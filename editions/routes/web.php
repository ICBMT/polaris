<?php

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('landing', [
        'framework' => app()->version(),
        'php' => PHP_VERSION,
    ]);
})->name('home');

/**
 * Tiny "heartbeat" endpoint the front-end polls every few seconds.
 * Powers the LIVE pill, server clock, latency readout and the
 * orders ticker — proof the page is talking to a real Laravel 13 app.
 */
Route::get('/api/pulse', function () {
    $startedAt = $_SERVER['REQUEST_TIME_FLOAT'] ?? microtime(true);
    $key = 'editions:ops';

    if (! Cache::has($key)) {
        Cache::forever($key, random_int(142_800_000, 142_900_000));
    }

    $ops = Cache::increment($key, random_int(3, 11));

    return response()->json([
        'status' => 'live',
        'framework' => 'Laravel ' . app()->version(),
        'php' => PHP_VERSION,
        'server_time_hms' => now()->format('H:i:s'),
        'tz' => config('app.timezone'),
        'ops_this_season' => $ops,
        'latency_ms' => round((microtime(true) - $startedAt) * 1000, 1),
    ]);
})->name('api.pulse');
