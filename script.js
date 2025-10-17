let hargaFilamentList = {pla:45.90, petg:49.90, abs:59.90};

function kemaskiniDropdown(){
  const jenisCetakan=document.getElementById("jenisCetakan");
  jenisCetakan.innerHTML="<option value='figura'>Figura</option><option value='part'>Part / Komponen</option>";

  const select=document.getElementById("filament");
  select.innerHTML="";
  for(const key in hargaFilamentList){
    const opt=document.createElement("option");
    opt.value=key;
    opt.text=key.toUpperCase();
    select.appendChild(opt);
  }

  setHargaAuto();
  updateSenaraiFilament();
}

function setHargaAuto(){
  const select = document.getElementById("filament");
  const jenis = select.value;
  const hargaInput = document.getElementById("harga");
  if(hargaFilamentList[jenis] !== undefined){
    hargaInput.value = hargaFilamentList[jenis].toFixed(2);
  } else {
    hargaInput.value = "0.00";
  }
}

function getPremiumExtra(){
  let kosPremiumExtra=0;
  let senaraiPremium=[];
  const hargaKemasan=parseFloat(document.getElementById("hargaKemasan").value)||0;
  const hargaCat=parseFloat(document.getElementById("hargaCat").value)||0;
  const hargaSanding=parseFloat(document.getElementById("hargaSanding").value)||0;

  if(document.getElementById("kemasan").checked){
    kosPremiumExtra+=hargaKemasan;
    senaraiPremium.push(`Kemasan = RM${hargaKemasan.toFixed(2)}`);
  }
  if(document.getElementById("cat").checked){
    kosPremiumExtra+=hargaCat;
    senaraiPremium.push(`Cat = RM${hargaCat.toFixed(2)}`);
  }
  if(document.getElementById("sanding").checked){
    kosPremiumExtra+=hargaSanding;
    senaraiPremium.push(`Sanding = RM${hargaSanding.toFixed(2)}`);
  }
  return {kosPremiumExtra, senaraiPremium};
}

function tambahFilament(){
  const nama=document.getElementById("filamentBaru").value.trim();
  const harga=parseFloat(document.getElementById("hargaBaru").value);
  if(!nama || isNaN(harga)) return alert("Isi nama & harga filament");
  hargaFilamentList[nama.toLowerCase()]=harga;
  kemaskiniDropdown();
}

function updateSenaraiFilament(){
  const list=document.getElementById("senaraiFilament");
  list.innerHTML="";
  for(const key in hargaFilamentList){
    const li=document.createElement("li");
    li.textContent=`${key.toUpperCase()} = RM${hargaFilamentList[key].toFixed(2)}`;
    const delBtn=document.createElement("button");
    delBtn.textContent="DELETE";
    delBtn.className="deleteBtn";
    delBtn.onclick=function(){
      delete hargaFilamentList[key];
      kemaskiniDropdown();
    }
    li.appendChild(delBtn);
    list.appendChild(li);
  }
}

function showHarga(type){
  const berat=parseFloat(document.getElementById("berat").value)||0;
  const hargaFilament=parseFloat(document.getElementById("harga").value)||0;
  const jam=parseFloat(document.getElementById("jam").value)||0;
  const minit=parseFloat(document.getElementById("minit").value)||0;
  const totalJam=jam+(minit/60);

  const kosFilament=berat*(hargaFilament/1000);
  const kosElektrik=totalJam*0.25;
  const kosSebenar=kosFilament+kosElektrik;

  const {kosPremiumExtra, senaraiPremium}=getPremiumExtra();
  const margin={standard:0.7,premium:1.2};

  let hargaTotal=0;
  if(type==='min') hargaTotal=Math.ceil(kosSebenar+1);
  else if(type==='std') hargaTotal=Math.ceil(kosSebenar*(1+margin.standard));
  else if(type==='prem') hargaTotal=Math.ceil(kosSebenar*(1+margin.premium)+kosPremiumExtra);

  document.getElementById("formulaStep").innerHTML=`
    <p>Kos Filament: RM${kosFilament.toFixed(2)}</p>
    <p>Kos Elektrik: RM${kosElektrik.toFixed(2)}</p>
    <p>Tambahan Premium: ${senaraiPremium.join(", ") || "Tiada"}</p>
  `;
  document.getElementById("hargaAkhir").textContent=`RM ${hargaTotal.toFixed(2)}`;
  document.getElementById("totalKosContainer").textContent=`Jumlah Kos Sebenar: RM ${kosSebenar.toFixed(2)}`;
}

function toggleManage(){
  const m=document.getElementById("manageWrapper");
  m.style.display=(m.style.display==="none"||m.style.display==="")?"block":"none";
}

function toggleKos(){
  const kos=document.getElementById("totalKosContainer");
  kos.style.display=(kos.style.display==="none"||kos.style.display==="")?"block":"none";
}

window.onload=function(){
  kemaskiniDropdown();
  document.getElementById("toggleManageBtn").addEventListener("click",toggleManage);
  document.getElementById("toggleKosBtn").addEventListener("click",toggleKos);
  document.getElementById("kiraBtn").addEventListener("click",()=>showHarga('min'));
  document.getElementById("filament").addEventListener("change", setHargaAuto);
};
