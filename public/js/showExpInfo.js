let dataName = [];
let index = 0;
let request = async () => {
    const response = await fetch('/api');
    const data = await response.json();
    dataName = data;
    console.log(dataName)
    index = Object.keys(dataName[0]).length;
    if(index === 9) {
        document.getElementsByTagName("li")[9].remove();
        document.getElementsByTagName("li")[18].remove();
        document.getElementsByTagName("li")[27].remove();

    }
    for (let i = 0; i < dataName.length; i++) {
        for (let y = i*index; y < index + i * index; y++) {
            
            document.getElementsByClassName("expertInfo")[y].innerHTML = Object.values(dataName[i])[y % index]; 
        }
    }
    
}
request()
