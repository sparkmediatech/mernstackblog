/*const sum  = [1,2,3,4,5,6,7]


let newSum = 0
for(let i = 0; i < sum.length; i++){
    
    newSum += sum[i]
}

const num = [2,2,2,2,2]

const sumArray = (arrayNumber)=> {
    let newSum = 0;

    for(let i = 0; i < arrayNumber.length; i++){
        newSum += arrayNumber[i]
       
    }
    return  console.log(newSum)
}
sumArray([...num])

//ES6 syntax 
const newTotalSum = num.reduce((previousElement, currentElement) => previousElement + currentElement)
console.log(newTotalSum);

//ES5 syntax
var addSum = num.reduce(function(previousElement, currentElement){
    return previousElement + currentElement
})

console.log(addSum)


const userInitialValues = {

name: "kingsley",

email: "kingsley@gmail.com"

}


const userUpdateReducer = (state, action)=>{

    switch(action.type){

      case "UPDATE_NAME":

       return { ...state, name: action.payload.name };

      

     case "UPDATE_EMAIL":

      return { ...state, email: action.payload.email };

     

      default:

      return state;

}

}

const action = {

  type: "UPDATE_NAME",

  payload: { name: "Peter" },

};

console.log(userUpdateReducer(userInitialValues, action))
*/


/* function createSetUnion (newSet1, newSet2){
    const getSetUnion = new Set(newSet1);

   for(const elemet of newSet2){
        getSetUnion.add(elemet)
   }
   return console.log(getSetUnion)
}

const set1 = new Set("abc");
const set2 = new Set("def");
createSetUnion(set1, set2)
*/
//Fill methods
//The fill() method, fills the elements of an array with a static value from the specified start position to the specified end position. If no start or end positions are specified, the whole array is filled.
//One thing to keep in mind is that this method modifies the original/given array.

//array.fill(value, start, end)

const newArray = ['orange', 'apple', 'mango', 'banana'];
const newValue = newArray.fill('rice', 1, 3);

console.log(newValue)


