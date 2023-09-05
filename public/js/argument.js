let count = 1;

function start() {
  count++;

  
  document.getElementById("regForm").submit();
  document.getElementById("regForm").reset();
  document.getElementById("numS").innerHTML = "№" + count;
}

let request = async () => {
    const response = await fetch('/diff');
    const data = await response.json();

    
    
    for (let i = 0; i < 19; i++) {
      if(!data.includes(i)) {
        console.log("flasdjflaksdf")
        document.getElementsByClassName("question")[i].style.display = "none"
      }
    }


}
request()

