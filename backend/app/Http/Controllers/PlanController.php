<?php

namespace App\Http\Controllers;

use App\Models\Plan;
use Illuminate\Http\Request;

class PlanController extends Controller
{
    public function index()
    {
        $plans = Plan::where('is_active', true)
            ->with(['hotel', 'stay', 'flight'])
            ->get()
            ->unique('title')
            ->values();

        return response()->json($plans);
    }

    public function show($id)
    {
        $plan = Plan::with(['hotel', 'stay', 'flight'])->findOrFail($id);
        return response()->json($plan);
    }

    public function store(Request $request)
    {
        \Illuminate\Support\Facades\Log::info("Storing plan. Request input: " . json_encode($request->all()));
        \Illuminate\Support\Facades\Log::info("Storing plan. Has image file: " . ($request->hasFile('image') ? 'yes' : 'no'));
        if ($request->hasFile('image')) {
            \Illuminate\Support\Facades\Log::info("Storing image file name: " . $request->file('image')->getClientOriginalName());
        }

        $request->validate([
            'title' => 'required|string|max:255',
            'duration' => 'required|string',
            'stops' => 'required',
            'price' => 'required|numeric',
            'theme' => 'required|string',
            'budget_level' => 'required|string',
            'activities' => 'nullable',
            'hotel_id' => 'nullable|exists:hotels,id',
            'stay_id' => 'nullable|exists:stays,id',
            'flight_id' => 'nullable|exists:flights,id',
            'is_active' => 'nullable',
            'max_travelers' => 'nullable|integer|min:1',
        ]);

        $data = $request->except(['image']);

        // Handle image upload or image URL string
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('plans', 'public');
            $data['image'] = '/storage/' . $path;
        } else if ($request->has('image')) {
            $data['image'] = $request->image;
        } else {
            $data['image'] = 'https://images.unsplash.com/photo-1488085061387-422e29b40080?q=80&w=2560&auto=format&fit=crop'; // fallback default
        }

        // Process json/array fields
        if (is_string($request->stops)) {
            $data['stops'] = json_decode($request->stops, true);
        }
        if (is_string($request->activities)) {
            $data['activities'] = json_decode($request->activities, true);
        }

        if ($request->has('is_active')) {
            $data['is_active'] = $request->is_active === 'true' || $request->is_active === '1' || $request->is_active === true;
        }

        $plan = Plan::create($data);

        return response()->json($plan->load(['hotel', 'stay', 'flight']), 201);
    }

    public function update(Request $request, $id)
    {
        $plan = Plan::findOrFail($id);

        \Illuminate\Support\Facades\Log::info("Updating plan ID: " . $id);
        \Illuminate\Support\Facades\Log::info("Request input: " . json_encode($request->all()));
        \Illuminate\Support\Facades\Log::info("Request has image file: " . ($request->hasFile('image') ? 'yes' : 'no'));
        if ($request->hasFile('image')) {
            \Illuminate\Support\Facades\Log::info("Image file name: " . $request->file('image')->getClientOriginalName());
        }

        $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'duration' => 'sometimes|required|string',
            'stops' => 'sometimes|required',
            'price' => 'sometimes|required|numeric',
            'theme' => 'sometimes|required|string',
            'budget_level' => 'sometimes|required|string',
            'activities' => 'nullable',
            'hotel_id' => 'nullable|exists:hotels,id',
            'stay_id' => 'nullable|exists:stays,id',
            'flight_id' => 'nullable|exists:flights,id',
            'is_active' => 'nullable',
            'max_travelers' => 'nullable|integer|min:1',
        ]);

        $data = $request->except(['image', '_method']);

        // Handle image upload or image URL string
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('plans', 'public');
            $data['image'] = '/storage/' . $path;
        } else if ($request->has('image')) {
            $data['image'] = $request->image;
        }

        // Process json/array fields
        if ($request->has('stops') && is_string($request->stops)) {
            $data['stops'] = json_decode($request->stops, true);
        }
        if ($request->has('activities') && is_string($request->activities)) {
            $data['activities'] = json_decode($request->activities, true);
        }

        if ($request->has('is_active')) {
            $data['is_active'] = $request->is_active === 'true' || $request->is_active === '1' || $request->is_active === true;
        }

        $plan->update($data);

        return response()->json($plan->load(['hotel', 'stay', 'flight']));
    }

    public function destroy($id)
    {
        \Illuminate\Support\Facades\Log::info("Destroying plan with ID: " . $id);
        try {
            $plan = Plan::findOrFail($id);
            $plan->delete();
            return response()->json(['message' => 'Plan deleted successfully']);
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error("Failed to delete plan ID " . $id . ": " . $e->getMessage());
            return response()->json(['message' => 'Failed to delete plan: ' . $e->getMessage()], 500);
        }
    }
}
