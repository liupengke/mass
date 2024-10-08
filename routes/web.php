<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Foundation\Application;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
	return Inertia::render('Welcome', [
		'canLogin' => Route::has('login'),
		'canRegister' => Route::has('register'),
		'laravelVersion' => Application::VERSION,
		'phpVersion' => PHP_VERSION,
	]);
});

Route::any('/goods/{pid}', function($pid){
	return Inertia::render('Goods', [
		'pid' => $pid,
		'pname' => 'Aquabeads EPOCH Character Bead Sets, AQ-S87, ST Mark Certified, For Ages 450 and Up, Toy, Water Sticks, Making Toy, Made by Epoch',
		'img' => 'https://m.media-amazon.com/images/I/91cFkQEsUGL._AC_SL1500_.jpg',
		'price' => '20.86',
	]);
});
