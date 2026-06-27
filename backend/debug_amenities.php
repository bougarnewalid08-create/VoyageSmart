<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Hotel;
use App\Models\Amenity;
use Illuminate\Support\Facades\DB;

$hotels = Hotel::with('amenities')->get();
foreach ($hotels as $hotel) {
    echo "Hotel: " . $hotel->name . "\n";
    $names = $hotel->amenities->pluck('name')->toArray();
    print_r(array_count_values($names));
    echo "------------------\n";
}
