const query=(query)=>{
    return document.querySelector(query);
}
const eleList = document.querySelectorAll(".modal-body input,.modal-body select");
const myTableBody = query("#myTable tbody");

const render = async ()=>{
    const data = await fetch('http://127.0.0.1:8080/api/tour/getAll',{
        method: "get",
    });
    const content = await data.json();
    const dataRaw = content.content;
    const dataRenderMapping =dataRaw.map((item)=>{
        return `
        <tr>
        <td>${item.IDnum}</td>
        <td>${item.nameF}</td>
        <td>${item.dateOfB}</td>
        <td>${item.phone}</td>
        <td>${item.location}</td>
        <td>${item.numOfDays}</td>
        <td>${item.dateOfDepart}</td>
        <td>
          <button class="btn btn-info" onclick="showUpPopup(${item.IDnum})" >Edit</button>
          <button class="btn btn-danger" onclick="getIDForDel(${item.IDnum})" >Delete</button>
        </td>
      </tr>
        `
    });
    myTableBody.innerHTML = dataRenderMapping.join(" ");
    
}
render();

const deleteBooking = async (id)=>{
    const rawData = await fetch(`http://127.0.0.1:8080/api/tour/delBooking/${id}`,{
      method: "delete"
    });
    const content = rawData.json();
    console.log(content);
}

const editBooking = async (id,data)=>{
  const rawData = await fetch(`http://127.0.0.1:8080/api/tour/updateBooking/${id}`,{
    method: "put",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
  },
    body: JSON.stringify(data)
  });
  const content = rawData.json();
  console.log(content);
  return content;
}

const findName = async (keyword) => {
  const rawData = await fetch('http://127.0.0.1:8080/api/tour/findByName',{
    method:"get",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({keyword,})
  })
  const content = rawData.json();
  return content;
}

const findId = async (id)=>{
  const rawData = await fetch(`http://127.0.0.1:8080/api/tour/findID/${id}`,{
    method: "get",
  })
  const content = rawData.json();
  return content;
}

const getIDForDel = async (id)=>{
    console.log(id);
    await deleteBooking(id);
    await render();
    alert("Delete succesfully !");
}

query("#search-text").onkeydown = ()=>{
  console.log("first")
}

const mapper = {
    name : "nameF",
    dayOfBirth: "dateOfB",
    Id: "IDnum",
    phone: "phone",
    days: "numOfDays",
    DayOfDep : "dateOfDepart"
}

const maperForRendering= (eleList,data)=>{
    const {nameF,dateOfB,IDnum,phone,numOfDays,dateOfDepart,location} = data;
    const mapping = {
      name : nameF,
      dayOfBirth: dateOfB.split("T")[0],
      Id: IDnum,
      phone: phone,
      location: location,
      days: numOfDays,
      DayOfDep : dateOfDepart.split("T")[0]
    }
    let count = 0;
    for(let key in mapping){
      eleList[count].value = mapping[key];
      if(eleList[count].id == "Id"){
        eleList[count].disabled = true;
      }
      count++;
    }
}

const modal = query(".modal");
const layer = query(".layer");
const showUpPopup = async (id)=>{
  modal.style.display = "block";
  layer.style.display = "block";
  const data = await findId(id);
  console.log(data);
  console.log(eleList);
  maperForRendering(eleList,data.content);
}
const closePopup = ()=>{
  modal.style.display = "none";
  layer.style.display = "none";
}

query(".btn-close").onclick = closePopup;
document.querySelector(".layer").addEventListener("click",closePopup);
query("#close-btn-popup").onclick = closePopup;

const handleUpdate = async ()=>{
  const newData = {
    name: "",
    dayOfBirth: "",
    IDnum: 111,
    phone: "113",
    location: "",
    numDays: 55,
    dateDep: ""
  }
  let count = 0;
  for (let key in newData) {
    if(key == "dayOfBirth" || key == "dateDep"){
      newData[key] = `${eleList[count].value}T12:01:30.543Z`;
    }else if(key == "IDnum" || key =="numDays"){
      newData[key] = Number(eleList[count].value);
    }else{
      newData[key] = eleList[count].value;
    }
    count++;
  }
  const {name,dayOfBirth,phone,location,numDays,dateDep} = newData;
  const res = await editBooking(newData.IDnum,{name,dayOfBirth,phone,location,numDays,dateDep});
  if(res.statusCode == 200){
    alert(res.msg);
  }else{
    alert(res.msg);
  }
  document.querySelector(".layer").click();
  render();
}
document.querySelector("#btn-submit").onclick = handleUpdate;