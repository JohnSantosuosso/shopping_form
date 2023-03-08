// Topics: Custom Events, Event Delegation, local storage, DOM events, object reference
const shoppingForm = document.querySelector(".shopping");
const list = document.querySelector(".list");

//array to hold our state
let items = [];

function handleSubmit(e) {
  e.preventDefault();
  console.log("submitted!!");
  const name = e.currentTarget.item.value; //pulls data in form field when submit button clicked
  console.log(name); //see what they added in
  //we want to store the item name and give it an id, so we create an object
  const item = {
    name: name,
    id: Date.now(),
    complete: false, //we want to set value to true when it's been added
  };
  //push items into our state
  items.push(item);
  console.log(`There are now ${items.length}`);
  //clear the form after an item has been submitted
  e.target.reset(); //used to clear
  //Step 3-fire off custom event that tells analytics that items have been updated
  list.dispatchEvent(new CustomEvent('itemsUpdated')) //dispatchEvent used to abstract logic so we don't have ton of events in here
}

//Step 2-display items by mapping over each one with our custom HTML and displaying
function displayItems() {
  const html = items
    .map(
      //apply css style to item and add checkbox and 'x' next to each item..label and value were added later so we can pull the ID of the button we're deleting
      (item) => `<li class="shopping-item">
      <input value="${item.id} "type="checkbox"
      ${item.complete && 'checked'}
      >
      <span class="itemName">${item.name}</span>
      <button
      arial-label="Remove ${item.name}"
      value="${item.id}"
      >&times;</button>
      </li>`
    )
    .join(""); //turn array into a list
  list.innerHTML = html; //sets the list element equal to the html we generated
}

//Step 4-mirror data to local storage so people can pickup where they left off
function mirrorToLocalStorage() {
  //sets local storage equal to the items but can only handle text, can't convert objects to string though
  //we can use JSON.stringify though to convert objects to string
  localStorage.setItem('items', JSON.stringify(items));
}

//Step 5-restore items from local storage, will run on page load
function restoreFromLocalStorage() {
  //pull items from local storage and use JSON.parse to turn strings back into objects
  const lsItems = JSON.parse(localStorage.getItem('items'));
  //check to see if there's a length because if not, we don't want to run bc nothing in local storage
  if(lsItems.length)
    //dump local storage items into items
    items.push(...lsItems); //uses ... called spread to push all items in string format 
    //create new dispatch event for updated items
    list.dispatchEvent(new CustomEvent('itemsUpdated'));
}

//Step 6-add delete and checkbox functionality
function deleteItem(id) {
  console.log('Deleting Item')
  //update our items array without this one
  items = items.filter(item => item.id !== id); //if ID not equal to item that was passed, we keep it
  list.dispatchEvent(new CustomEvent('itemsUpdated')); //because we updated items we fire this again
}

function markAsComplete(id) {
  const itemRef = items.find(item => item.id === id); //find item based on ID
  itemRef.complete = !itemRef.complete //set property of item to be equal to the opposite

}

//Event listener for when submit button is clicked
shoppingForm.addEventListener("submit", handleSubmit);
//Step 2 & 3--listens for itemsUpdated and runs displayItems when hit
list.addEventListener('itemsUpdated', displayItems);
//Step 4--mirror to local storage
list.addEventListener('itemsUpdated', mirrorToLocalStorage);

//Step 6-account for delete and checkboxes but also have to account for if a new item is added
//listening for clicks for things that don't yet exist on page, it will not listen for them
//We have to use 'event delegation' which listens for clicks for things we know will be there
//We listen for click on list <ul> but delegate to button if it is clicked ('button css selector)
//Frameworks like React and Angular are great because it won't need to rerender the entire list each time an item is added
//and items can be deleted dynamically which leads to faster performance
list.addEventListener('click', function(e) {
  if(e.target.matches('button')) //target is what we clicked on, matches is the css selector
  deleteItem(parseInt(e.target.value)); //delete item based on its ID
  if(e.target.matches('input[type="checkbox"]')){
    markAsComplete(parseInt(e.target.value));
  }
});

//Step 5--Restore from local storage
restoreFromLocalStorage();
