const { kMaxLength } = require('buffer');
const fs = require('fs');
const createCsvWriter = require('csv-writer').createArrayCsvWriter;


// ***** V1 GET DATAS WITH REGEX, THEN TYPE DATAS, TO FINISH CREATE CSV ... all this with tests *****

// *** PROCESS START POINT ***
function startTransfert(){

  try {

    console.log('Start transfert...');
  
    //GET AND TEST input file extension
    const dataIN = './data.txt';
    testExtensionIN(dataIN);

    //GET AND TEST input meta file extension
    const dataOUT = './meta.csv';
    testExtensionOUT(dataOUT);

    // READ data file AND TEST type of result
    const rawData = fs.readFileSync(dataIN, 'utf8').trim();
    testRawType(rawData);

    // ISOLATE each user in array AND TEST types
    const arrayRawData = isolateUsers(rawData);
    testRawArrayType(arrayRawData);

    // GET STRUCTURE in meta file
    const outmetaDatas = meta(dataOUT);
    testoutmetaDatas(outmetaDatas);

    // GET DATAS USERS
    const outRawdata = getDatas(arrayRawData);
    testoutRawdata(outRawdata,outmetaDatas);
    
    // CREATE .csv out
    csvOut(outRawdata,outmetaDatas);

    // LOG PROCESS
    appLog(rawData,arrayRawData,outRawdata,outmetaDatas);//TODO ERASE BEFORE PRODUCTION

  } catch (err) {
    console.error('DEV LOG -> startTransfert FUNCTION FAIL');
    console.error(err);
  }

}




// ***FUNCTIONS PROCESS***

// Separe each user
function isolateUsers(rawData){

  try {

  // separe each line enter string
  const reg= new RegExp("[\r\n]+", "g");
  const arrayRawData = rawData.split(reg);

  return(arrayRawData);

  } catch (err) {
    console.error('DEV LOG -> isolateUsers FUNCTION FAIL');
  }

}

// Get data for each user
function getDatas(arrayRawData){
  
  try {
    
    //init a empty array
    const outRawdata=[];
      
    // For each person extract person datas
    arrayRawData.forEach(element => {

      // Init array
      const personDatas=[];

      // Clean space before and after
      const trimElement = element.trim();

      // Save person datas into array
      personDatas.push(getDate(trimElement)); // Get birth date
      personDatas.push(getFirstname(trimElement)); // Get first name
      personDatas.push(getLastname(trimElement)); // Get last name
      personDatas.push(getWeightNumber(trimElement)); // Get weight

      // Save one person datas into all persons array datas
      outRawdata.push(personDatas);
          
    });

  return(outRawdata)

  } catch (err) {
    console.error('DEV LOG -> getDatas FUNCTION FAIL');
  }

}

// Extract meta.txt 
function meta(dataOUT) {
  
  try {
  
    // Retrived a string data enter
    const metaData = fs.readFileSync(dataOUT, 'utf8').trim();

    // Separe each datas into string 
    const reg= new RegExp("[\r\n]+", "g");
    const arrayMetaData= metaData.split(reg);

    //init a empty array
    const outmetaDatas=[];

    // For each column extract person datas
    arrayMetaData.forEach(element => {

      const columnDatas = element.split(',');

      // save column datas array into array
      outmetaDatas.push(columnDatas);

    });

    return (outmetaDatas)
  
  } catch (err) {
    console.error('DEV LOG -> meta FUNCTION FAIL');
  }

}

// GET birth date and type date 
function getDate(element){

  try{

    const birthDateString = element.substring(0,10);
    const birthDateTypeDate = new Date(birthDateString).toLocaleDateString("fr");

    return (birthDateTypeDate);

  } catch (err) {
    console.error('DEV LOG -> getDate FUNCTION FAIL');
  }

};

// GET first name in data.txt
function getFirstname(element){

  try{

    const firstNameString = getFullName(element)[0];
    return (firstNameString);

  } catch (err) {
    console.error('DEV LOG -> getFirstname FUNCTION FAIL');
  }

};

// GET last name in data.txt
function getLastname(element){

  try{

    const lastNameString = getFullName(element)[1];
    return (lastNameString);

  } catch (err) {
    console.error('DEV LOG -> getLastname FUNCTION FAIL');
  }

};

// GET weight number and type number 
function getWeightNumber(element){
  
  try{

    const weightString = element.replace(/^.*\s/, "");// get the last datas after the last space
    const weightNumber = Number.parseFloat(weightString, 10);

    return(weightNumber);

  } catch (err) {
    console.error('DEV LOG -> getWeightNumber FUNCTION FAIL');
  }

}

// GET full name in data.txt
function getFullName(element){

  try{

    const reg2= new RegExp("[^0-9 ]{2,}","g");
    const fullNameString = element.match(reg2);

    return(fullNameString);

  } catch (err) {
    console.error('DEV LOG -> getFullName FUNCTION FAIL');
  }

};

// GET header for csv title 
function getheader(outmetaDatas){

  try{

    const header= [];

    outmetaDatas.forEach(element => {
      header.push(element[0]);
    });

    return(header);

  } catch (err) {
    console.error('DEV LOG -> getheader FUNCTION FAIL');
  }

};

// CREATE .csv file
function csvOut(outRawdata,outmetaDatas){
 
  try{
    
    // params csv header and file path
    const csvWriter = createCsvWriter({
      header: getheader(outmetaDatas),
      path: 'transfert_datas.csv'
    });
  
    // create csv out file delimiter by default ,
    csvWriter.writeRecords(outRawdata)
      .then(() => {
        console.log('...Transfert Done'); //TODO ERASE BEFORE PRODUCTION
      });

  } catch (err) {
    console.error('DEV LOG -> csvOut FUNCTION FAIL');
  }
};

function appLog (rawData,arrayRawData,outRawdata,outmetaDatas){

  // log IN data string
  console.log('-> DATA IN TYPE STRING <-');
  console.log(rawData);

  // log ISOLATE strings
  console.log('-> ISOLATE EACH USER <-');
  console.log(arrayRawData);

  // log datas with type
  console.log('-> EXTRACT AND TYPE <-');
  console.log(outRawdata);

  // log header structure
  console.log('-> HEADER STRUCTURE <-');
  console.log(outmetaDatas);

};



// *** Test Process ***

// Test input extension file
function testExtensionIN(dataIN){

    const regex = new RegExp('.txt');

    if(!regex.test(dataIN)){
      throw 'FAIL TEST -> The input file type is not .txt';
    
    }
    console.log('OK TEST -> Extension of the input file');

};

function testExtensionOUT(dataOUT){

  const regex = new RegExp('.csv');

  if(!regex.test(dataOUT)){
    throw 'FAIL TEST -> The input mata file type is not .csv';
  
  }
  console.log('OK TEST -> Extension of the input meta file');

};

// Test input extension file
function testRawType(rawData){

    if(typeof(rawData) !== 'string'){
      throw 'FAIL TEST -> the input file tranfert is not a string';

    }else{

      console.log('OK TEST -> Input file transfert type');

    }
};

// Test type of array and index
function testRawArrayType(arrayRawData){
  
  // Test type
  if(typeof(arrayRawData) !== 'object'){
    throw 'FAIL TEST -> The isolate result is not an array';
  }else{

    console.log('OK TEST -> Type of isolate array');

    // Test index is type of string
    let count = 0;

    arrayRawData.forEach(element => {

      count++;

      if(typeof(element) !== 'string'){
        throw `FAIL TEST -> the data array at index ${count} is not a string`;
      }

    });

    console.log('OK TEST -> Type of all isolate array index');
  }

  

};

// Test outmetaDatas type and index type
function testoutmetaDatas(outmetaDatas){

  // 1 - Test type
  if(typeof(outmetaDatas) !== 'object'){
    throw 'FAIL TEST -> outmetaDatas is not an array';
  };
  console.log('OK TEST -> Type of outmetaDatas');

  // 2 - Test each index type
  let count = 0;

  outmetaDatas.forEach(element => {

    count++;

    if(typeof(element) !== 'object'){
      throw `FAIL TEST -> outmetaDatas array in testoutRawdata at index ${count} is not a objet`;
    }

  });
  console.log('OK TEST -> Type of all outmetaDatas index');

};

// Test outmetaDatas type and index type
function testoutRawdata(outRawdata,outmetaDatas){

  // 1 - Test type
  if(typeof(outRawdata) !== 'object'){
    throw 'FAIL TEST -> The isolate result is not an array';
  };
  console.log('OK TEST -> Type of outRawdata');

  // 2 - Test each index type
  let count = 0;

  outRawdata.forEach(element => {

    count++;

    // TEST if index an object
    if(typeof(element) !== 'object'){
      throw `FAIL TEST -> outRawdata array in testoutRawdata at index ${count} is not a objet`;
    }

    const dateLength = outmetaDatas[0][1];
    const firstLength = outmetaDatas[1][1];
    const lastLength = outmetaDatas[2][1];
    const weightLength = outmetaDatas[3][1];

    // ---------- TEST DATE --------------
    
    // Test if a good date size
    if (element[0].length != dateLength){
      throw `FAIL TEST -> outRawdata array in testoutRawdata at index ${count} date is not good size`;
    };

    // Test if a valid date
    const parseDate = element[0].split('/');

    // day >0 and <31
    if(!parseInt(parseDate[0],10) > 0 & !parseInt(parseDate[0],10) <= 31 ){
      throw `FAIL TEST -> outRawdata array in testoutRawdata at index ${count} day in date fail`;
    }

    // mounth >0 and <12
    if(!parseInt(parseDate[1],10) > 0 & !parseInt(parseDate[1],10) <= 12 ){
      throw `FAIL TEST -> outRawdata array in testoutRawdata at index ${count} month in date fail`;
    }

     // year >1900 and <2032
    if(!parseInt(parseDate[2],10) > 1900 & !parseInt(parseDate[2],10) <= 2032 ){
      throw `FAIL TEST -> outRawdata array in testoutRawdata at index ${count} year in date fail`;
    }

    // ----------- TEST FIRST NAME ------------

    // TEST SIZE
    if (element[1].length > firstLength){
      throw `FAIL TEST -> outRawdata array in testoutRawdata at index ${count} first name is not good size`;
    };

    // TEST TYPE INTO META.CSV DOCUMENT
    const typeFirst = function (){
      if(outmetaDatas[1][2] !== 'string'){
        throw `FAIL TEST -> type of first name into .txt is not string`;
      }else{
        return('string')
      }
    }

    if(typeof(element[1]) !== typeFirst()){
      throw `FAIL TEST -> outRawdata array in testoutRawdata at index ${count} first name is not good type`;
    }

    //----------- TEST LAST NAME ------------

    // TEST SIZE
    if (element[2].length > lastLength){
      throw `FAIL TEST -> outRawdata array in testoutRawdata at index ${count} last name is not good size`;
    };

    // TEST TYPE INTO META.CSV DOCUMENT
    const typeLast = function (){
      if(outmetaDatas[2][2] !== 'string'){
        throw `FAIL TEST -> type of last name into .txt is not string`;
      }else{
        return('string')
      }
    }

    // TEST TYPE
    if(typeof(element[2]) !== typeLast()){
      throw `FAIL TEST -> outRawdata array in testoutRawdata at index ${count} last name is not good type`;
    }

    // ----------- TEST WEIGHT ------------

    // TEST SIZE
    if (element[3].length > weightLength){
      throw `FAIL TEST -> outRawdata array in testoutRawdata at index ${count} weight is not good size`;
    };

    // TEST TYPE INTO META.CSV DOCUMENT
    const typeWeight = function (){
      if(outmetaDatas[3][2] === 'numeric'){
        return('number');
      }else{
        throw `FAIL TEST -> type of weight into .txt is not numeric`;
      }
    }

    // TEST TYPE
    if(typeof(element[3]) !== typeWeight()){
      throw `FAIL TEST -> outRawdata array in testoutRawdata at index ${count} weight is not good type`;
    }

  });

  // IF ALL TEST GOOD
  console.log('OK TEST -> Type of all outRawdata index');

};



// *** Start process *** 
startTransfert();