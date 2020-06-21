
const thingEnum = {
    WOLF: "wolf",
    GOAT: "goat",
    CABBAGE: "cabbage"
}

const directionEnum = {
    LEFT: "left",
    RIGHT: "right"
}

var boatCargo = null;
var boatDirection = directionEnum.LEFT;

function initGame() {
    console.log("init game...");

    //hide land-right stuff
    document.getElementById("right-wolf").style.display = "none";
    document.getElementById("right-goat").style.display = "none";
    document.getElementById("right-cabbage").style.display = "none";
}

//NOTE: you can probably consolidate all the similiar click methods into 
//one click method but I don't feel like doing it
function clickedLeftWolf() {
    placeThingOnLandToBoat(directionEnum.LEFT, thingEnum.WOLF);
}

function clickedLeftGoat() {
    placeThingOnLandToBoat(directionEnum.LEFT, thingEnum.GOAT);
}

function clickedLeftCabbage() {
    placeThingOnLandToBoat(directionEnum.LEFT, thingEnum.CABBAGE);
}

function clickedRightWolf() {
    placeThingOnLandToBoat(directionEnum.RIGHT, thingEnum.WOLF);
}

function clickedRightGoat() {
    placeThingOnLandToBoat(directionEnum.RIGHT, thingEnum.GOAT);
}

function clickedRightCabbage() {
    placeThingOnLandToBoat(directionEnum.RIGHT, thingEnum.CABBAGE);
}

/**
 * move boat to the other side. and check game rules
 */
function clickedBoatMan() {
    let imgBoat = document.getElementById("boatman");
    let imgCargo = document.getElementById("boat-cargo");

    //move boat and cargo
    if (boatDirection == directionEnum.LEFT) {  //go right
        //boat
        boatDirection = directionEnum.RIGHT;
        imgBoat.style.left = "600px";
        imgBoat.style.transform = " scaleX(-1)";

        //cargo
        imgCargo.style.left = "670px";
        imgCargo.style.transform = " scaleX(-1)";
    }
    else {  //go left
        //boat
        boatDirection = directionEnum.LEFT;
        imgBoat.style.left = "200px";
        imgBoat.style.transform = " scaleX(1)";

        //cargo
        imgCargo.style.left = "200px";
        imgCargo.style.transform = " scaleX(-1)";
    }

    //check failure
    let eatenMessage = checkEatingRules();
    if (eatenMessage != null) {
        alert(eatenMessage);
    }

    //TODO: end game
    //TODO: reset
}

/**
 * move boat to the other side. and check game rules
 */
function clickedBoatCargo() {
    placeThingOnLandFromBoat();
    
    //check success
    if(checkEverythingIsOnRightLand()){
        alert("Success!");
    }
}

/**
 * Take a thing on the boat and put it on the land.
 * If not possible, do nothing.
 */
function placeThingOnLandFromBoat() {
    //nothing to move
    if (boatCargo == null)
        return;

    let img;
    if (boatDirection == directionEnum.LEFT)
        img = document.getElementById(`left-${boatCargo}`);
    else //right
        img = document.getElementById(`right-${boatCargo}`);

    img.style.display = "block";
    img.src = `img/${boatCargo}.png`;

    //empty boat
    boatCargo = null;
    document.getElementById("boat-cargo").style.display = "none";
}

/**
 * Take a thing from land and put it on the boat.
 * If not possible, do nothing.
 * @param {directionEnum} direction 
 * @param {thingEnum} thing 
 */
function placeThingOnLandToBoat(direction, thing) {
    //boat's full
    if (boatCargo != null)
        return;

    //boat's not on that side of the land
    if (boatDirection != direction)
        return;

    let landThingImg;
    if (direction == directionEnum.LEFT)
        landThingImg = document.getElementById(`left-${thing}`);
    else //right
        landThingImg = document.getElementById(`right-${thing}`);

    //thing isn't on land
    if (landThingImg.style.display == "none")
        return;

    //empty land
    landThingImg.style.display = "none";

    //place on boat
    boatCargo = thing;
    let boatImg = document.getElementById("boat-cargo");
    boatImg.src = `img/${thing}.png`;
    boatImg.style.display = "block";
}

/**
 * Called after boat is moved.
 * See if something ate something.
 * @returns {String} message if something was eaten. null otherwise.
 */
function checkEatingRules() {
    let errorMsg = null;
    if (boatDirection == directionEnum.LEFT) {
        errorMsg = checkEatingRulesForOneLand(directionEnum.RIGHT);
    }
    else {//check right land
        errorMsg = checkEatingRulesForOneLand(directionEnum.LEFT);
    }

    return errorMsg;
}

/**
 * Check either the left or right land.
 * Checks Eating rules.
 * wolf eats goat.
 * goat eats cabbage.
 * @param {directionEnum} direction the left or right land to check
 * @returns {String} if something was eaten, then a message. null otherwise.
 */
function checkEatingRulesForOneLand(direction) {
    let imgWolf = document.getElementById(`${direction}-${thingEnum.WOLF}`);
    let imgGoat = document.getElementById(`${direction}-${thingEnum.GOAT}`);
    let imgCabbage = document.getElementById(`${direction}-${thingEnum.CABBAGE}`);

    let hasWolf = imgWolf.style.display == "none" ? false : true;
    let hasGoat = imgGoat.style.display == "none" ? false : true;
    let hasCabbage = imgCabbage.style.display == "none" ? false : true;

    if (hasWolf && hasGoat)
        return "The wolf has eaten the goat.";

    if (hasGoat && hasCabbage)
        return "The goat has eaten the cabbage.";

    return null;
}

/**
 * Are all the things on the right side?
 * @returns {boolean} true on success. false otherwise.
 */
function checkEverythingIsOnRightLand() {
    let imgWolf = document.getElementById(`right-${thingEnum.WOLF}`);
    let imgGoat = document.getElementById(`right-${thingEnum.GOAT}`);
    let imgCabbage = document.getElementById(`right-${thingEnum.CABBAGE}`);

    let hasWolf = imgWolf.style.display == "none" ? false : true;
    let hasGoat = imgGoat.style.display == "none" ? false : true;
    let hasCabbage = imgCabbage.style.display == "none" ? false : true;

    return hasWolf && hasGoat && hasCabbage;
}