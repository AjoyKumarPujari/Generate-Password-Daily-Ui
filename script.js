const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider() ;
//set strength circle color grey

//set password length
function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
}

function setIndicator(color){
    indicator.style.background = color;   
}

//getRandomInteger
function getRandomInteger(min, max){
    return Math.floor(Math.random() *(max-min)) + min;
}

function generateRandomNumber(){
    return getRandomInteger(0, 9);
}

function generateRandomLowerCase(){
    return String.fromCharCode(getRandomInteger(97, 123));
}

function generateRandomUpperCase(){
    return String.fromCharCode(getRandomInteger(65, 91));
}

function generateSymbol(){
    const randNum = getRandomInteger(0, symbols.length);
    return symbols.charAt(randNum);
}

function calcStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (numbersCheck.checked) hasNum = true;
    if (symbolsCheck.checked) hasSym = true;
  
    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
      setIndicator("#0f0");
    } else if (
      (hasLower || hasUpper) &&
      (hasNum || hasSym) &&
      passwordLength >= 6
    ) {
      setIndicator("#ff0");
    } else {
      setIndicator("#f00");
    }
}

//copy to clickboard
async function copyContent() {
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied";
    }
    catch(e) {
        copyMsg.innerText = "Failed";
    }
    //to make copy wala span visible
    copyMsg.classList.add("active");

    setTimeout( () => {
        copyMsg.classList.remove("active");
    },2000);

}

function suffflePassword(array){
    //fisher rates method
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

function handleCheckboxChange() {
    checkCount = 0;
    allCheckBox.forEach((checkbox)=>{
        if(checkbox.checked)
            checkCount++;
    });

    //special condition
    if(passwordLength < checkCount ){
        passwordLength = checkCount; 
        handleSlider();
    }
}

allCheckBox.forEach( (checkbox)=>{
    checkbox.addEventListener('change', handleCheckboxChange);
})


inputSlider.addEventListener('input', (e)=>{
    passwordLength = e.target.value;
    handleSlider();
})

copyBtn.addEventListener('click', () => {
    if(passwordDisplay.value){
        copyContent();
    }
})
// generate Password
generateBtn.addEventListener('click', () => {
    //none of the checkbox are selected

    if(checkCount == 0) 
    return;

    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
    //lets start to generate new pasasword

    console.log("starting the journey");
    //remove all password
    password = "";

    //lets  put the staff mention by checkboxes

    // if(uppercaseCheck.checked){
    //     password += generateRandomUpperCase();
    // }
    // if(lowercaseCheck.checked){
    //     password += generateRandomLowerCase();
    // }
    // if(numbersCheck.checked){
    //     password += generateRandomNumber();
    // }
    // if(symbolsCheck.checked){
    //     password += generateSymbol();
    // }

    let functionArr =[];

    if(uppercaseCheck.checked)
        functionArr.push(generateRandomUpperCase);

    if(lowercaseCheck.checked)
        functionArr.push(generateRandomLowerCase);
    
    if(numbersCheck.checked)
        functionArr.push(generateRandomNumber);
    
    if(symbolsCheck.checked)
        functionArr.push(generateSymbol);

        //compulsary addition
        for(let i=0; i<functionArr.length; i++){
            password+=functionArr[i]();
        }
        console.log("compulsary addition done");

        //remaining addition
        for (let i=0; i<passwordLength-functionArr.length; i++){
            let randIndex = getRandomInteger(0, functionArr.length)
            password += functionArr[randIndex]();
        }
        console.log("remaining addition done");
        //shufffled
        password = suffflePassword(Array.from(password));
        console.log("sufffling done");
        //show in Ui
        passwordDisplay.value = password;
        console.log("UI addition done");
        //calculate strength
        calcStrength();
        
});
 