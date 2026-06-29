<?php

use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\StayController;
use App\Http\Controllers\ReservationController;
use Illuminate\Support\Facades\Route;

// Public Routes
Route::post('/login', [UserController::class, 'login']);
Route::post('/register', [UserController::class, 'register']);

Route::get('/stays', [StayController::class, 'index']);
Route::get('/stays/{id}', [StayController::class, 'show']);

Route::get('/hotels', [\App\Http\Controllers\HotelController::class, 'index']);
Route::get('/hotels/{id}', [\App\Http\Controllers\HotelController::class, 'show']);

// Public availability check
Route::post('/hotels/{id}/availability', [ReservationController::class, 'checkAvailability']);
Route::post('/stays/{id}/availability', [ReservationController::class, 'checkStayAvailability']);

Route::get('/flights', [\App\Http\Controllers\FlightController::class, 'index']);
Route::get('/flights/{id}', [\App\Http\Controllers\FlightController::class, 'show']);

Route::get('/plans', [\App\Http\Controllers\PlanController::class, 'index']);
Route::get('/plans/{id}', [\App\Http\Controllers\PlanController::class, 'show']);

// Protected Routes
Route::middleware('auth:sanctum')->group(function () {
    // Stay Management
    Route::post('/stays', [StayController::class, 'store']);
    Route::put('/stays/{id}', [StayController::class, 'update']);
    Route::delete('/stays/{id}', [StayController::class, 'destroy']);

    // Hotel Management
    Route::post('/hotels', [\App\Http\Controllers\HotelController::class, 'store']);
    Route::put('/hotels/{id}', [\App\Http\Controllers\HotelController::class, 'update']);
    Route::delete('/hotels/{id}', [\App\Http\Controllers\HotelController::class, 'destroy']);

    // Reservations
    Route::post('/reservations', [ReservationController::class, 'store']);
    Route::get('/my-reservations', [ReservationController::class, 'myReservations']);
    Route::put('/reservations/{id}/cancel', [ReservationController::class, 'cancel']);

    // Favorites
    Route::get('/favorites', [\App\Http\Controllers\FavoriteController::class, 'index']);
    Route::post('/favorites/toggle', [\App\Http\Controllers\FavoriteController::class, 'toggle']);

    // Flights Management
    Route::post('/flights', [\App\Http\Controllers\FlightController::class, 'store']);
    Route::put('/flights/{id}', [\App\Http\Controllers\FlightController::class, 'update']);
    Route::delete('/flights/{id}', [\App\Http\Controllers\FlightController::class, 'destroy']);

    // Admin only
    Route::middleware('admin')->group(function () {
        Route::get('/users', [UserController::class, 'index']);
    });
});