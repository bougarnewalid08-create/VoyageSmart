<?php

namespace App\Http\Controllers;

use App\Models\Stay;
use App\Models\StayImage;
use App\Models\Amenity;
use App\Models\StayRule;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class StayController extends Controller
{
    public function index()
    {
        $stays = Stay::with(['host', 'images', 'amenities', 'rules'])->where('is_active', true)->get();
        return response()->json($stays);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'property_type' => 'required|string',
            'location' => 'required|string',
            'city' => 'required|string',
            'country' => 'required|string',
            'price_per_night' => 'required|numeric',
            'guests' => 'required|integer',
            'bedrooms' => 'nullable|integer',
            'beds' => 'nullable|integer',
            'bathrooms' => 'nullable|integer',
            'area' => 'nullable|numeric',
            'description' => 'required|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif,webp|max:5120',
            'user_id' => 'required|exists:users,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $request->except(['image', 'images', 'amenities', 'rules']);
        
        $stay = Stay::create($data);

        $this->syncRelations($stay, $request);

        return response()->json($stay->load(['images', 'amenities', 'rules']), 201);
    }

    public function show($id)
    {
        $stay = Stay::with(['host', 'images', 'amenities', 'rules'])->find($id);
        if (!$stay) {
            return response()->json(['message' => 'Stay not found'], 404);
        }
        return response()->json($stay);
    }

    public function update(Request $request, $id)
    {
        $stay = Stay::find($id);
        if (!$stay) {
            return response()->json(['message' => 'Stay not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'property_type' => 'sometimes|required|string',
            'price_per_night' => 'sometimes|required|numeric',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif,webp|max:5120',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $request->except(['image', 'images', 'amenities', 'rules', '_method']);
        $stay->update($data);

        $this->syncRelations($stay, $request);

        return response()->json($stay->load(['images', 'amenities', 'rules']));
    }

    private function syncRelations(Stay $stay, Request $request)
    {
        // Handle Main Image
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('stays', 'public');
            StayImage::create([
                'stay_id' => $stay->id,
                'image' => '/storage/' . $path,
                'is_main' => true,
                'order' => 0
            ]);
        }

        // Handle Gallery Images
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $path = $image->store('stays/gallery', 'public');
                StayImage::create([
                    'stay_id' => $stay->id,
                    'image' => '/storage/' . $path,
                    'is_main' => false,
                    'order' => $stay->images()->count()
                ]);
            }
        }

        // Handle Amenities (Relational)
        if ($request->has('amenities')) {
            $amenitiesList = is_string($request->amenities) ? json_decode($request->amenities, true) : ($request->amenities ?? []);
            $amenityIds = [];
            foreach ($amenitiesList as $amenityName) {
                $amenity = Amenity::firstOrCreate(['name' => $amenityName]);
                $amenityIds[] = $amenity->id;
            }
            $stay->amenities()->sync($amenityIds);
        }

        // Handle Rules (Relational)
        if ($request->has('rules')) {
            $rulesList = is_string($request->rules) ? json_decode($request->rules, true) : ($request->rules ?? []);
            // Simple approach: delete old and create new
            $stay->rules()->delete();
            foreach ($rulesList as $ruleText) {
                StayRule::create([
                    'stay_id' => $stay->id,
                    'rule' => $ruleText
                ]);
            }
        }
    }

    public function destroy($id)
    {
        $stay = Stay::find($id);
        if (!$stay) {
            return response()->json(['message' => 'Stay not found'], 404);
        }

        $stay->delete();
        return response()->json(['message' => 'Stay deleted successfully']);
    }
}
