<?php

namespace App\Http\Controllers;

use App\Models\Hotel;
use App\Models\HotelImage;
use App\Models\Amenity;
use Illuminate\Http\Request;

class HotelController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $hotels = Hotel::with(['images', 'amenities'])->where('is_active', true)->orderBy('created_at', 'desc')->get();
        return response()->json($hotels);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'location' => 'required|string',
            'city' => 'required|string',
            'country' => 'required|string',
            'description' => 'required|string',
            'price' => 'required|numeric',
            'image' => 'nullable|image|max:5120',
            'images.*' => 'image|max:5120',
            'user_id' => 'required|exists:users,id',
            'stars' => 'nullable|integer',
            'is_premier' => 'nullable',
            'total_rooms' => 'nullable|integer|min:1'
        ]);

        $data = $request->except(['images', 'amenities']);
        
        // Handle boolean
        if ($request->has('is_premier')) {
            $data['is_premier'] = $request->is_premier === 'true' || $request->is_premier === '1' || $request->is_premier === true;
        }

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('hotels', 'public');
            $data['image'] = '/storage/' . $path;
        }

        // Default available_rooms to total_rooms for new hotels
        if ($request->has('total_rooms')) {
            $data['available_rooms'] = $request->total_rooms;
        } else {
            $data['total_rooms'] = 10; // Default
            $data['available_rooms'] = 10;
        }

        $hotel = Hotel::create($data);

        $this->syncRelations($hotel, $request);

        return response()->json($hotel->load(['images', 'amenities']), 201);
    }

    public function show($id)
    {
        $hotel = Hotel::with(['images', 'amenities'])->find($id);
        if (!$hotel) return response()->json(['message' => 'Hotel not found'], 404);
        return response()->json($hotel);
    }

    public function update(Request $request, $id)
    {
        $hotel = Hotel::find($id);
        if (!$hotel) return response()->json(['message' => 'Hotel not found'], 404);

        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'location' => 'sometimes|required|string',
            'city' => 'sometimes|required|string',
            'country' => 'sometimes|required|string',
            'description' => 'sometimes|required|string',
            'price' => 'sometimes|required|numeric',
            'image' => 'nullable',
            'images.*' => 'image|max:5120',
            'stars' => 'nullable|integer',
            'is_premier' => 'nullable',
            'total_rooms' => 'nullable|integer|min:1'
        ]);

        $data = $request->except(['images', 'amenities']);
        
        // Handle boolean
        if ($request->has('is_premier')) {
            $data['is_premier'] = $request->is_premier === 'true' || $request->is_premier === '1' || $request->is_premier === true;
        }

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('hotels', 'public');
            $data['image'] = '/storage/' . $path;
        }

        $hotel->update($data);

        $this->syncRelations($hotel, $request);

        return response()->json($hotel->load(['images', 'amenities']));
    }

    public function destroy($id)
    {
        $hotel = Hotel::find($id);
        if (!$hotel) return response()->json(['message' => 'Hotel not found'], 404);
        $hotel->delete();
        return response()->json(['message' => 'Hotel deleted successfully']);
    }

    private function syncRelations(Hotel $hotel, Request $request)
    {
        // Handle Multiple Images
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $path = $image->store('hotels/gallery', 'public');
                $hotel->images()->create([
                    'image' => '/storage/' . $path,
                    'is_main' => false
                ]);
            }
        }

        // Handle Amenities
        if ($request->has('amenities')) {
            $amenityNames = is_array($request->amenities) ? $request->amenities : json_decode($request->amenities, true);
            if ($amenityNames) {
                $amenityIds = [];
                foreach ($amenityNames as $name) {
                    $amenity = Amenity::firstOrCreate(['name' => $name]);
                    $amenityIds[] = $amenity->id;
                }
                $hotel->amenities()->sync($amenityIds);
            }
        }
    }
}
