// Basic hash function that works with strings only:

// underlying UTF16 character code (every character has a numeric value associated with it); accessible using .charCodeAt(index); in below example 0 corresponds to 0 index of string "a", which is only one character
// console.log("a".charCodeAt(0));  //=> 97  <-- the number for a
// console.log("hi".charCodeAt(0));  //=> 104  <-- the number for h
// console.log("hi".charCodeAt(1));  //=> 105  <-- the number for i
// //if you subtract 96, it gives the alphabetic position or ranking
// console.log("a".charCodeAt(0) - 96);  //=> 1
// console.log("d".charCodeAt(0) - 96);  //=> 4
// console.log("z".charCodeAt(0) - 96);  //=> 26

// do this for every character in a string
let total = 0;
total += "hello".charCodeAt(0) - 96;
total += "hello".charCodeAt(1) - 96;
total += "hello".charCodeAt(2) - 96;
total += "hello".charCodeAt(3) - 96;
total += "hello".charCodeAt(4) - 96;
// console.log(total); //=> 52
// 52 is not valid for a hash function with a string and length parameter of 11 (length of array); an index that is valid is needed and 52 is too large.
// hash("hello", 11)
// use modulo % (remainder) operator to keep it within these bounds
// console.log(total % 11);  //=> 8 this number is valid to store data in 

// This hash function takes two parameters (ie. "pink", and number length)
function hash(key, arrayLen){
  // make a total variable
  let total = 0;
  //loop through the characters in the key "p-i-n-k"
  for(let char of key){
    //map "a" to 1, "b" to 2, "c", to 3, etc.
    //grab the char code in a value
    let value = char.charCodeAt(0) - 96;
    //add the character code for each character to the total and find the remainder by the array length
    total = (total + value) % arrayLen;
  }
  return total;
}
//function called with a string and an index less than 10
// console.log(hash("pink", 10)); //=> 0
// console.log(hash("orangered", 10)); //=> 7
// console.log(hash("cyan", 10)); //=> 3
// console.log(hash("orange", 10)); //=> 0 
// console.log(hash("blue", 10)); //=> 0
// console.log(hash("purple", 10)); //=> 8
// console.log(hash("maroon", 10)); //=> 6

// ^^This hash function above has a few problems^^:
// 1. It only hashes strings
// 2. Not constant time - linear in key length
// 3. Could be a little more random (ie. the data clusters easily with pink/orange/blue)

// Example of old hash function:
function hashTwo(key, arrayLen){
  let total = 0;
  for(let i=0; i < key.length; i++){
    let char = key[i];
    let value = char.charCodeAt(0) - 96;
    total = (total + value) % arrayLen;
  }
  return total;
}

//Example of revised hash function
// hash functions take advantage of prime numbers (it helps to reduce collisions so data is not stored in the same bucket (if it can be avoided); makes sure we are spreading data out as much as possible so it's faster to retrieve). If two pieces of data for the fist 100 characters are the same and they collide, that's ok and it can be stored in the same place (if all data is colliding than function needs to be adjusted).
function hashThree(key, arrayLen){
  let total = 0;
  //add a prime number to decrease the number of collisions so data is more distributed/more random
  let WEIRD_PRIME = 31;
  // use Math.min() and if key is less than 100 {loop key length, otherwise loop at most 100 characters}; this speeds up the function
  for(let i=0; i < Math.min(key.length, 100); i++){
    let char = key[i];
    let value = char.charCodeAt(0) - 96;
    total = (total * WEIRD_PRIME + value) % arrayLen;
  }
  return total;
}
//function called with array length that is a prime number
console.log(hashThree("hello", 13)); //=> 7
console.log(hashThree("goodbye", 13)); //=> 9
console.log(hashThree("hi", 13)); //=> 10
console.log(hashThree("cyan", 13)); //=> 5