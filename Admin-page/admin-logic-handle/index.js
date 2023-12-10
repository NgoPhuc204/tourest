const getEle= (query)=>{
    return document.querySelector(query);
}

const postData = async(data)=>{
    const rawRes = await fetch("http://127.0.0.1:8080/api/tour/bookingNow",{
        method: "post",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    const content = await rawRes.json();
    return content;
}

const submitHandle = async ()=>{
    const values = document.querySelectorAll("#myForm input,#myForm select");
    let valueList = [];
    values.forEach((ele)=>{
        console.log(ele.value);
        valueList.push(ele.value);
    });
    const bookingDetail = {};
    const keyList = ["name","dayOfBirth","idNum","phone","location","numDays","dateDep"];
    for (let index = 0; index < keyList.length; index++) {
        if(keyList[index] == "idNum" || keyList[index] =="numDays"){
            bookingDetail[keyList[index]] = Number(valueList[index]);
        }else if(keyList[index] == "dayOfBirth" || keyList[index] =="dateDep"){
            bookingDetail[keyList[index]] = `${valueList[index]}T12:01:30.543Z`;
        }else{
            bookingDetail[keyList[index]] = valueList[index];
        }
    };
    console.log(bookingDetail);
    const data = await postData(bookingDetail);
    console.log(data);
    if(data.statusCode == 400){
        alert(data.msg);
        return;
    }
    alert("Succesful !");
}

getEle("button#btn-submit").onclick = submitHandle;

