const query=(query)=>{
    return document.querySelector(query);
}

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
}

const findName = async (keyword) => {
  const rawData = await fetch('http://127.0.0.1:8080/api/tour/findByName',{
    method:"get",
    body: JSON.stringify({keyword,})
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

const modal = query(".modal");
const layer = query(".layer");
const showUpPopup = (id)=>{
  modal.style.display = "block";
  layer.style.display = "block";
  console.log(id);
}
const closePopup = ()=>{
  modal.style.display = "none";
  layer.style.display = "none";
}

query(".btn-close").onclick = closePopup;
document.querySelector(".layer").addEventListener("click",closePopup);
query("#close-btn-popup").onclick = closePopup;