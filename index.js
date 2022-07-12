const fs = require('fs');
const createCsvWriter = require('csv-writer').createArrayCsvWriter;

// ---------- 1- extract data.txt ----------
function startTransfert(){
  try {
  
    // Retrived a string data enter
    const rawData = fs.readFileSync('./data.txt', 'utf8');

    // Separe each user datas into string 
    const reg= new RegExp("[\r\n]+", "g");
    const arrayRawData = rawData.split(reg);

    // delete last index
    arrayRawData.pop(); 

    //init a empty array
    const outRawdata=[];

    // For each person extract person datas
    arrayRawData.forEach(element => {

      const personDatas=[];

      // save person datas into array
      personDatas.push(getDate(element));
      personDatas.push(getFirstname(element));
      personDatas.push(getLastname(element));
      personDatas.push(getWeightNumber(element));

      // save person datas array into array
      outRawdata.push(personDatas);
          
    });
    
    // launch meta fonction
    meta(outRawdata);

  } catch (err) {
    console.error(err);
  }
}

// ---------- 2- extract meta.txt ----------
function meta(outRawdata) {
  
  try {
  
  // Retrived a string data enter
  const metaData = fs.readFileSync('./meta.csv', 'utf8');
    
  // Separe each datas into string 
  const reg= new RegExp("[\r\n]+", "g");
  const arrayMetaData= metaData.split(reg);

  // delete last index
  arrayMetaData.pop();

  //init a empty array
  const outmetaDatas=[];

  // For each column extract person datas
  arrayMetaData.forEach(element => {

    const columnDatas = element.split(',');

    // save column datas array into array
    outmetaDatas.push(columnDatas);

  });

  // launch csvOut fonction
  csvOut(outRawdata,outmetaDatas);

  } catch (err) {
    console.error(err);
  }
}

// ---------- 3- Create a new csv file ----------
function csvOut(outRawdata,outmetaDatas){
 
  try{
    
    const csvWriter = createCsvWriter({
      header: getheader(outmetaDatas),
      path: 'transfert_datas.csv'
    });
  
    const records = outRawdata;
  
    csvWriter.writeRecords(records) // returns a promise
      .then(() => {
        console.log('...Transfert Done');
      });

  } catch (err) {
    console.error(err);
  }
}

// Get weight number in data.txt
function getWeightNumber(element){
    
  const weightString = element.replace(/^.*\s/, "").trim();
  const weightNumber = Number.parseFloat(weightString, 10);

  return(weightNumber);
}

// Get birth date in data.txt
function getDate(element){

  const birthDateString = element.substring(0,10);
  const birthDateTypeDate = new Date(birthDateString).toLocaleDateString("fr");

  return (birthDateTypeDate);
};

// get first name in data.txt
function getFirstname(element){

  const firstNameString = getFullName(element)[0];

  return (firstNameString);
};

// get first name in data.txt
function getLastname(element){
  const lastNameString = getFullName(element)[1];

  return (lastNameString);
};

// Get full name in data.txt
function getFullName(element){
   
  const reg2= new RegExp("[^0-9 ]{2,}","g");
  const fullNameString = element.match(reg2);

  return(fullNameString);
};

// Get header for csv title 
function getheader(outmetaDatas){

  const header= [];

  outmetaDatas.forEach(element => {
    header.push(element[0]);
  });

  return(header);
};

// *** Start process *** 
startTransfert();