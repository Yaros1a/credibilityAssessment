let count = 1;

function start() {
  count++;

  document.getElementById("regForm").submit();
  document.getElementById("regForm").reset();
  document.getElementById("numS").innerHTML = "№" + count;
}

let dataName = [];
let text = ""

let request = async () => {
    const response = await fetch('/diff');
    const data = await response.json();
    for (let i = 0; i < 19; i++) {
      if(!data.includes(i)) {
        document.getElementsByClassName("question")[i].style.display = "none"
        document.getElementsByTagName("hr")[i].style.display = "none"


      } 
    }

    const response1 = await fetch('/argum');
    const data1 = await response1.json();
    
    console.log(data1)
    for (let i = 0; i < data1.length; i++) {
      for (let j = 0; j < 19; j++) {
        if(Object.values(data1[i])[j] != ""){
          text += String(j + 1) + ". " + Object.values(data1[i])[j] + "<br>" ;
        }
      }
      console.log(text)
      document.getElementsByClassName("expert")[i].innerHTML = "Expert" + String(i + 1) + "<br>" + text ;
      text = ""
    }
}
request()

