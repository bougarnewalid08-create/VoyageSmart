<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Favorite;
use App\Models\Hotel;
use App\Models\Stay;
use App\Models\Flight;
use App\Models\Plan;
use Illuminate\Support\Facades\Auth;

class FavoriteController extends Controller
{
    /**
     * Get all favorites for the authenticated user.
     */
    public function index(Request $request)
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['error' => 'Unauthenticated'], 401);
        }

        $favorites = Favorite::where('user_id', $user->id)->get();
        return response()->json($favorites);
    }

    /**
     * Toggle a favorite status for a given item.
     */
    public function toggle(Request $request)
    {
        $request->validate([
            'item_type' => 'required|string|in:hotel,stay,flight,plan',
            'item_id' => 'required|integer'
        ]);

        $user = $request->user();
        if (!$user) {
            return response()->json(['error' => 'Unauthenticated'], 401);
        }

        $item_type = $request->item_type;
        $item_id = $request->item_id;

        // Check if it already exists
        $existing = Favorite::where('user_id', $user->id)
            ->where('item_type', $item_type)
            ->where('item_id', $item_id)
            ->first();

        if ($existing) {
            $existing->delete();
            return response()->json(['status' => 'removed']);
        } else {
            Favorite::create([
                'user_id' => $user->id,
                'item_type' => $item_type,
                'item_id' => $item_id
            ]);
            return response()->json(['status' => 'added']);
        }
    }
}
