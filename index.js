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
// This hash function takes two parameters (ie. "pink", and number length)
function hashTwo(key, arrayLen){
  // make a total variable
  let total = 0;
  //loop through each character in the key
  for(let i=0; i < key.length; i++){
    //grab each character in a variable
    let char = key[i];
    //grab the char code in a value
    let value = char.charCodeAt(0) - 96;
    //add the character code for each character to the total and find the remainder by the array length
    total = (total + value) % arrayLen;
  }
  return total;
}

//Example of revised hash function
// hash functions take advantage of prime numbers (it helps to reduce collisions so data is not stored in the same bucket (if it can be avoided); makes sure we are spreading data out as much as possible so it's faster to retrieve). If two pieces of data for the fist 100 characters are the same and they collide, that's ok and it can be stored in the same place (if all data is colliding than function needs to be adjusted).
// This hash function takes two parameters (ie. "pink", and number length)
function hashThree(key, arrayLen){
  // make a total variable
  let total = 0;
  //add a prime number to decrease the number of collisions so data is more distributed/more random
  let WEIRD_PRIME = 31;
  // use Math.min() and if key is less than 100 {loop key length, otherwise loop at most 100 characters}; this speeds up the function
  for(let i=0; i < Math.min(key.length, 100); i++){
    //grab each character in a variable
    let char = key[i];
    //grab the char code in a value
    let value = char.charCodeAt(0) - 96;
    //multiply the total and WEIRD PRIME, then add the value for each char to the total; find the remainder by the array length
    total = (total * WEIRD_PRIME + value) % arrayLen;
  }
  return total;
}
//function called with array length that is a prime number
// console.log(hashThree("hello", 13)); //=> 7
// console.log(hashThree("goodbye", 13)); //=> 9
// console.log(hashThree("hi", 13)); //=> 10
// console.log(hashThree("cyan", 13)); //=> 5
//_______________________________________________________________

// Basic hash function that works with strings only:
//Hash Table Class (implements a hash table using an array)

//creates a hash table (array) of a certain length
class HashTable{
  //accepts a size parameter for the length of hash table (default length of 53 (prime number); best to be a prime number)
  constructor(size=53){
    //create a new array of given size and store it as keyMap (keyMap is where all of the data will be stored)
    this.keyMap = new Array(size);
  }

  //To look up values by key, a hash function converts keys into valid array indices (takes data of arbitrary size and returns data of a fixed size; the same input gives the same output):
  // This hash function takes one parameter (ie. "pink")
  _hash(key){
    // make a total variable to return
    let total = 0;
    //use a prime number to decrease the number of collisions so data is more distributed through array
    let WEIRD_PRIME = 31;
    // use Math.min() and if key is less than 100 {loop keys length, or loop at most 100 characters}; this speeds up the function
    for(let i=0; i< Math.min(key.length, 100); i++){
      //grab each character in a variable
      let char = key[i];
      //grab char code for every character in the key and put in a value variable
      let value = char.charCodeAt(0) - 96;
      //multiply the total and WEIRD PRIME, then add the value for each char to the total; find the remainder by the arrays length (this.keyMap.length)
      total = (total * WEIRD_PRIME + value) % this.keyMap.length;
    }
    //return the total
    return total;
  }

  //set method created using "separate chaining" (stores collisions in an nested DS (array for this example))
  //set accepts two parameters (key, value)
  set(key, value){
    //hashes the key to determine the index to put it in
    let index = this._hash(key);
    //stores the key-value pair in the hash table array via separate chaining:
    //if the index in keyMap is empty {set that index of keyMap to an empty array}
    if(!this.keyMap[index]){
      this.keyMap[index] = [];
    }
    //than, either way push an array of key-value pair to the index at keyMap
    this.keyMap[index].push([key, value]);
  }

  //get accepts one parameter (key)
  get(key){
    //hashes the key  to determine the index to look in
    let index = this._hash(key);
    //retrieves the key-value pair in the hash table:
    //if the keyMap has the index
    if(this.keyMap[index]){
      //loop through that index to find the key-value
      for(let i=0; i<this.keyMap[index].length; i++){
        //if keyMap index's first item in its sub array equals key {return that sub array} (sub arrays are -->[ ['maroon', '#800000'] and ['yellow', '#FFFF00'] ]<--maroon and yellow are first items in subarrays) 
        if(this.keyMap[index][i][0] === key){
          //return the entire subarray inside index:
          // return this.keyMap[index][i]
          //return the value of key-value pair of the subarray:
          return this.keyMap[index][i][1]
        }
      }
    }
    //otherwise, if key isn't found, return undefined
    return undefined;
  }
  
}

let ht = new HashTable();
// console.log(ht.set("hello world", "goodbye!!"));
// console.log(ht.set("dogs", "are cool"));
// console.log(ht.set("cats", "are fine"));
// console.log(ht.set("i love", "pizza"));

let ht2 = new HashTable(17);
ht2.set("maroon","#800000")
ht2.set("yellow","#FFFF00")
ht2.set("olive","#808000")
ht2.set("salmon","#FA8072")
ht2.set("lightcoral","#F08080")
ht2.set("mediumvioletred","#C71585")
ht2.set("plum","#DDA0DD")
console.log(ht2.get("maroon"));
