<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use App\Models\Hotel;
use Illuminate\Http\Request;

class ReservationController extends Controller
{
    /**
     * Check if a hotel is available for the given dates.
     */
    public function checkAvailability(Request $request, $hotelId)
    {
        $request->validate([
            'check_in' => 'required|date',
            'check_out' => 'required|date|after:check_in',
        ]);

        $hotel = Hotel::find($hotelId);
        if (!$hotel) {
            return response()->json(['message' => 'Hotel not found'], 404);
        }

        $activeReservationsCount = Reservation::where('hotel_id', $hotelId)
            ->whereIn('status', ['pending', 'confirmed'])
            ->where(function ($query) use ($request) {
                $query->where(function ($q) use ($request) {
                    $q->where('check_in', '<=', $request->check_in)
                      ->where('check_out', '>', $request->check_in);
                })->orWhere(function ($q) use ($request) {
                    $q->where('check_in', '<', $request->check_out)
                      ->where('check_out', '>=', $request->check_out);
                })->orWhere(function ($q) use ($request) {
                    $q->where('check_in', '>=', $request->check_in)
                      ->where('check_out', '<=', $request->check_out);
                });
            })
            ->count();

        $isAvailable = $activeReservationsCount < $hotel->total_rooms;

        return response()->json([
            'available' => $isAvailable,
            'rooms_left' => $hotel->total_rooms - $activeReservationsCount,
            'total_rooms' => $hotel->total_rooms,
            'hotel_id' => $hotelId,
            'check_in' => $request->check_in,
            'check_out' => $request->check_out,
        ]);
    }

    /**
     * Check if a stay is available for the given dates.
     */
    public function checkStayAvailability(Request $request, $stayId)
    {
        $request->validate([
            'check_in' => 'required|date',
            'check_out' => 'required|date|after:check_in',
        ]);

        $stay = \App\Models\Stay::find($stayId);
        if (!$stay) {
            return response()->json(['message' => 'Stay not found'], 404);
        }

        // Overlapping logic: check if there's any active reservation overlapping for this stay
        $hasOverlap = Reservation::where('stay_id', $stayId)
            ->whereIn('status', ['pending', 'confirmed'])
            ->where(function ($query) use ($request) {
                $query->where(function ($q) use ($request) {
                    $q->where('check_in', '<=', $request->check_in)
                      ->where('check_out', '>', $request->check_in);
                })->orWhere(function ($q) use ($request) {
                    $q->where('check_in', '<', $request->check_out)
                      ->where('check_out', '>=', $request->check_out);
                })->orWhere(function ($q) use ($request) {
                    $q->where('check_in', '>=', $request->check_in)
                      ->where('check_out', '<=', $request->check_out);
                });
            })
            ->exists();

        return response()->json([
            'available' => !$hasOverlap,
            'stay_id' => $stayId,
            'check_in' => $request->check_in,
            'check_out' => $request->check_out,
        ]);
    }

    /**
     * Store a new reservation.
     */
    public function store(Request $request)
    {
        $request->validate([
            'hotel_id' => 'nullable|exists:hotels,id',
            'stay_id' => 'nullable|exists:stays,id',
            'flight_id' => 'nullable|exists:flights,id',
            'plan_id' => 'nullable|exists:plans,id',
            'seat_number' => 'nullable|string',
            'check_in' => 'nullable|date',
            'check_out' => 'nullable|date',
            'adults' => 'required|integer|min:1',
            'children' => 'nullable|integer|min:0',
            'nightly_price' => 'nullable|numeric',
            'service_fee' => 'nullable|numeric',
            'total_amount' => 'required|numeric',
            'nights' => 'nullable|integer|min:1',
        ]);

        if ($request->hotel_id) {
            // Double-check availability before booking
            $hotel = Hotel::find($request->hotel_id);
            if (!$hotel) {
                return response()->json(['message' => 'Hotel not found'], 404);
            }
            
            $activeReservationsCount = Reservation::where('hotel_id', $request->hotel_id)
                ->whereIn('status', ['pending', 'confirmed'])
                ->where(function ($query) use ($request) {
                    $query->where(function ($q) use ($request) {
                        $q->where('check_in', '<=', $request->check_in)
                          ->where('check_out', '>', $request->check_in);
                    })->orWhere(function ($q) use ($request) {
                        $q->where('check_in', '<', $request->check_out)
                          ->where('check_out', '>=', $request->check_out);
                    })->orWhere(function ($q) use ($request) {
                        $q->where('check_in', '>=', $request->check_in)
                          ->where('check_out', '<=', $request->check_out);
                    });
                })
                ->count();

            if ($activeReservationsCount >= $hotel->total_rooms) {
                return response()->json([
                    'message' => 'This hotel is fully booked for the selected dates. Please choose different dates.'
                ], 409);
            }

            $roomNumber = 'RM-' . str_pad(rand(1, $hotel->total_rooms), 3, '0', STR_PAD_LEFT);
        } else if ($request->stay_id) {
            $stay = \App\Models\Stay::find($request->stay_id);
            if (!$stay) {
                return response()->json(['message' => 'Stay not found'], 404);
            }

            $hasOverlap = Reservation::where('stay_id', $request->stay_id)
                ->whereIn('status', ['pending', 'confirmed'])
                ->where(function ($query) use ($request) {
                    $query->where(function ($q) use ($request) {
                        $q->where('check_in', '<=', $request->check_in)
                          ->where('check_out', '>', $request->check_in);
                    })->orWhere(function ($q) use ($request) {
                        $q->where('check_in', '<', $request->check_out)
                          ->where('check_out', '>=', $request->check_out);
                    })->orWhere(function ($q) use ($request) {
                        $q->where('check_in', '>=', $request->check_in)
                          ->where('check_out', '<=', $request->check_out);
                    });
                })
                ->exists();

            if ($hasOverlap) {
                return response()->json([
                    'message' => 'This stay is already booked for the selected dates. Please choose different dates.'
                ], 409);
            }

            $roomNumber = 'STAY-' . $request->stay_id;
        } else if ($request->flight_id) {
            $flight = \App\Models\Flight::find($request->flight_id);
            if (!$flight) {
                return response()->json(['message' => 'Flight not found'], 404);
            }

            $occupied = $flight->occupied_seats ?: [];
            if (in_array($request->seat_number, $occupied)) {
                return response()->json([
                    'message' => 'This seat is already occupied. Please select another seat.'
                ], 409);
            }

            $occupied[] = $request->seat_number;
            $flight->occupied_seats = $occupied;
            $flight->available_seats = max(0, $flight->available_seats - 1);
            $flight->save();

            $checkIn = $flight->departure_time->toDateString();
            $checkOut = $flight->arrival_time->toDateString();
            $nights = 1;
            $nightlyPrice = $request->total_amount;
            $serviceFee = 0.00;
            $roomNumber = $request->seat_number;
        } else if ($request->plan_id) {
            $plan = \App\Models\Plan::find($request->plan_id);
            if (!$plan) {
                return response()->json(['message' => 'Plan not found'], 404);
            }

            // Check if the user already has an active booking for this plan
            $existing = Reservation::where('user_id', $request->user()->id)
                ->where('plan_id', $request->plan_id)
                ->whereIn('status', ['pending', 'confirmed'])
                ->exists();

            if ($existing) {
                return response()->json([
                    'message' => 'You already have an active booking for this travel package.'
                ], 409);
            }

            preg_match('/\d+/', $plan->duration, $matches);
            $nights = isset($matches[0]) ? (int)$matches[0] : 1;
            $startDate = $request->check_in ? \Carbon\Carbon::parse($request->check_in) : now();
            $checkIn = $startDate->toDateString();
            $checkOut = $startDate->copy()->addDays($nights)->toDateString();
            $roomNumber = 'PLAN-' . $request->plan_id;

            // Automatically book hotels and stays in the plan
            $activities = $plan->activities ?? [];
            $totalHotelCost = 0;
            $childBookingsData = [];

            foreach ($activities as $dayData) {
                $day = $dayData['day'] ?? 1;
                $dayActivities = $dayData['activities'] ?? [];

                foreach ($dayActivities as $act) {
                    if (isset($act['type']) && $act['type'] === 'hotel') {
                        $hotelDbId = $act['hotel_db_id'] ?? null;
                        $stayDbId = $act['stay_db_id'] ?? null;

                        // Check-in date for this specific hotel/stay
                        $subCheckIn = $startDate->copy()->addDays($day - 1)->toDateString();

                        // Determine check-out date (look ahead to next check-in or end of plan)
                        $subCheckOut = $checkOut;
                        foreach ($activities as $nextDayData) {
                            $nextDay = $nextDayData['day'] ?? 1;
                            if ($nextDay > $day) {
                                foreach ($nextDayData['activities'] ?? [] as $nextAct) {
                                    if (isset($nextAct['type']) && $nextAct['type'] === 'hotel') {
                                        $subCheckOut = $startDate->copy()->addDays($nextDay - 1)->toDateString();
                                        break 2;
                                    }
                                }
                            }
                        }

                        $subNights = max(1, \Carbon\Carbon::parse($subCheckIn)->diffInDays(\Carbon\Carbon::parse($subCheckOut)));

                        if ($hotelDbId) {
                            $hotel = \App\Models\Hotel::find($hotelDbId);
                            if ($hotel) {
                                $subPrice = $hotel->price;
                                $subServiceFee = $subNights * 5;
                                $subTotal = ($subPrice * $subNights) + $subServiceFee;
                                $totalHotelCost += $subTotal;

                                $childBookingsData[] = [
                                    'type' => 'hotel',
                                    'model' => $hotel,
                                    'data' => [
                                        'user_id' => $request->user()->id,
                                        'hotel_id' => $hotel->id,
                                        'check_in' => $subCheckIn,
                                        'check_out' => $subCheckOut,
                                        'adults' => $request->adults ?? 2,
                                        'children' => $request->children ?? 0,
                                        'nightly_price' => $subPrice,
                                        'service_fee' => $subServiceFee,
                                        'total_amount' => $subTotal,
                                        'nights' => $subNights,
                                        'status' => 'confirmed',
                                        'room_number' => 'RM-' . str_pad(rand(1, $hotel->total_rooms), 3, '0', STR_PAD_LEFT)
                                    ]
                                ];
                            }
                        } else if ($stayDbId) {
                            $stay = \App\Models\Stay::find($stayDbId);
                            if ($stay) {
                                $subPrice = $stay->price_per_night;
                                $subServiceFee = $subNights * 5;
                                $subTotal = ($subPrice * $subNights) + $subServiceFee;
                                $totalHotelCost += $subTotal;

                                $childBookingsData[] = [
                                    'type' => 'stay',
                                    'model' => $stay,
                                    'data' => [
                                        'user_id' => $request->user()->id,
                                        'stay_id' => $stay->id,
                                        'check_in' => $subCheckIn,
                                        'check_out' => $subCheckOut,
                                        'adults' => $request->adults ?? 2,
                                        'children' => $request->children ?? 0,
                                        'nightly_price' => $subPrice,
                                        'service_fee' => $subServiceFee,
                                        'total_amount' => $subTotal,
                                        'nights' => $subNights,
                                        'status' => 'confirmed',
                                        'room_number' => 'STAY-' . $stay->id
                                    ]
                                ];
                            }
                        }
                    }
                }
            }

            // Calculate total package price
            $flightCost = $plan->flight ? $plan->flight->price : 250;
            $gasCost = $plan->gas_expense;
            $foodCost = $plan->food_expense;
            $serviceFee = 25.00;

            $totalAmount = $totalHotelCost + $flightCost + $gasCost + $foodCost + $serviceFee;
            $nightlyPrice = $totalAmount / $nights;
        } else {
            return response()->json(['message' => 'Either hotel_id, stay_id, flight_id, or plan_id is required'], 400);
        }

        $reservation = Reservation::create([
            'user_id' => $request->user()->id,
            'hotel_id' => $request->hotel_id,
            'stay_id' => $request->stay_id,
            'flight_id' => $request->flight_id,
            'plan_id' => $request->plan_id,
            'seat_number' => $request->seat_number,
            'check_in' => ($request->flight_id || $request->plan_id) ? $checkIn : $request->check_in,
            'check_out' => ($request->flight_id || $request->plan_id) ? $checkOut : $request->check_out,
            'adults' => $request->adults,
            'children' => $request->children ?? 0,
            'nightly_price' => ($request->flight_id || $request->plan_id) ? $nightlyPrice : $request->nightly_price,
            'service_fee' => ($request->flight_id || $request->plan_id) ? $serviceFee : $request->service_fee,
            'total_amount' => $request->plan_id ? $totalAmount : $request->total_amount,
            'nights' => ($request->flight_id || $request->plan_id) ? $nights : $request->nights,
            'status' => 'confirmed',
            'room_number' => $roomNumber,
        ]);

        if ($request->plan_id && count($childBookingsData) > 0) {
            foreach ($childBookingsData as $childData) {
                $childData['data']['parent_id'] = $reservation->id;
                Reservation::create($childData['data']);

                if ($childData['type'] === 'hotel') {
                    $hotelModel = $childData['model'];
                    if ($hotelModel->available_rooms > 0) {
                        $hotelModel->decrement('available_rooms');
                    }
                }
            }
        }

        if ($request->hotel_id && isset($hotel) && $hotel->available_rooms > 0) {
            $hotel->decrement('available_rooms');
        }

        return response()->json([
            'message' => 'Reservation confirmed successfully!',
            'reservation' => $reservation->load(['hotel', 'stay', 'flight', 'plan', 'children.hotel', 'children.stay.images']),
        ], 201);
    }

    /**
     * Get all reservations for the authenticated user.
     */
    public function myReservations(Request $request)
    {
        $reservations = Reservation::where('user_id', $request->user()->id)
            ->whereNull('parent_id')
            ->with(['hotel', 'stay.images', 'flight', 'plan', 'children.hotel', 'children.stay.images'])
            ->orderBy('check_in', 'desc')
            ->get();

        return response()->json($reservations);
    }

    /**
     * Cancel a reservation.
     */
    public function cancel($id, Request $request)
    {
        $reservation = Reservation::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->first();

        if (!$reservation) {
            return response()->json(['message' => 'Reservation not found'], 404);
        }

        if ($reservation->status === 'cancelled') {
            return response()->json(['message' => 'Reservation is already cancelled'], 400);
        }

        $reservation->update(['status' => 'cancelled']);

        if ($reservation->plan_id) {
            $children = Reservation::where('parent_id', $reservation->id)
                ->where('status', '!=', 'cancelled')
                ->get();
            
            foreach ($children as $child) {
                $child->update(['status' => 'cancelled']);
                if ($child->hotel_id) {
                    $hotel = Hotel::find($child->hotel_id);
                    if ($hotel && $hotel->available_rooms < $hotel->total_rooms) {
                        $hotel->increment('available_rooms');
                    }
                }
            }
        }

        if ($reservation->hotel_id) {
            // Logic: Increment available_rooms (releasing inventory)
            $hotel = Hotel::find($reservation->hotel_id);
            if ($hotel && $hotel->available_rooms < $hotel->total_rooms) {
                $hotel->increment('available_rooms');
            }
        } elseif ($reservation->flight_id) {
            // Logic: Remove seat from flight's occupied_seats array
            $flight = \App\Models\Flight::find($reservation->flight_id);
            if ($flight) {
                $occupied = $flight->occupied_seats ?: [];
                $occupied = array_values(array_diff($occupied, [$reservation->seat_number]));
                $flight->occupied_seats = $occupied;
                $flight->available_seats = min($flight->total_seats, $flight->available_seats + 1);
                $flight->save();
            }
        }

        return response()->json([
            'message' => 'Reservation cancelled successfully.',
            'reservation' => $reservation,
        ]);
    }
}
