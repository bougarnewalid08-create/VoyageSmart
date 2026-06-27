<?php

namespace App\Http\Controllers;

use App\Models\Flight;
use Illuminate\Http\Request;

class FlightController extends Controller
{
    public function index()
    {
        $flights = Flight::where('is_active', true)
            ->where('departure_time', '>', now())
            ->orderBy('departure_time', 'asc')
            ->get();
            
        return response()->json($flights);
    }

    public function show($id)
    {
        $flight = Flight::findOrFail($id);
        return response()->json($flight);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'airline' => 'required|string',
            'airline_logo' => 'nullable|string',
            'flight_number' => 'required|string',
            'departure_airport' => 'required|string',
            'arrival_airport' => 'required|string',
            'departure_city' => 'required|string',
            'arrival_city' => 'required|string',
            'departure_time' => 'required|date|after_or_equal:today',
            'arrival_time' => 'required|date|after:departure_time',
            'duration' => 'required|integer',
            'price' => 'required|numeric',
            'cabin_class' => 'nullable|string',
            'total_seats' => 'nullable|integer',
            'available_seats' => 'nullable|integer',
            'occupied_seats' => 'nullable|array',
            'is_active' => 'boolean'
        ]);

        if (!isset($validated['available_seats'])) {
            $validated['available_seats'] = $validated['total_seats'] ?? 150;
        }

        $flight = Flight::create($validated);
        return response()->json($flight, 201);
    }

    public function update(Request $request, $id)
    {
        $flight = Flight::findOrFail($id);

        $rules = [
            'airline' => 'string',
            'airline_logo' => 'nullable|string',
            'flight_number' => 'string',
            'departure_airport' => 'string',
            'arrival_airport' => 'string',
            'departure_city' => 'string',
            'arrival_city' => 'string',
            'departure_time' => 'date',
            'arrival_time' => 'date|after:departure_time',
            'duration' => 'integer',
            'price' => 'numeric',
            'cabin_class' => 'nullable|string',
            'total_seats' => 'nullable|integer',
            'available_seats' => 'nullable|integer',
            'occupied_seats' => 'nullable|array',
            'is_active' => 'boolean'
        ];

        if ($request->has('departure_time') && $request->input('departure_time') !== $flight->departure_time) {
            $rules['departure_time'] = 'date|after_or_equal:today';
        }

        $validated = $request->validate($rules);

        $flight->update($validated);
        return response()->json($flight);
    }

    public function destroy($id)
    {
        $flight = Flight::findOrFail($id);
        $flight->delete();
        return response()->json(null, 204);
    }
}
