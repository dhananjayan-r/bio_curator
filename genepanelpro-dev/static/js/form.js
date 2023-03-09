var panelalert= document.getElementById("alert")
var genealer= document.getElementById("alertt")
var checkboxdiv = document.getElementById("checkboxes")
var selectbox = document.getElementById("selects")
var genedrops = document.getElementById("genelist")
var expanded = false;
var wholesgenes =[]
var genenameing =[]




function genePopulator(data, showOnly=false){
    let htmlContent = ''
    data.map(function (i){
        if (genenameing[0]){
            if(genenameing[0].indexOf(i)>-1){
                htmlContent +=`<button type="button" onclick="popup('${i}')" class="btn btn-warning" style="margin:1px" data-toggle="modal" data-target="#myModal">`+i+`</button>&nbsp`
            }
            else{
                htmlContent +=`<button type="button" onclick="popup('${i}')" class="btn btn-info" style="margin:1px" data-toggle="modal" data-target="#myModal">`+i+`</button>&nbsp`
            }
        }  
        else{
            htmlContent +=`<button type="button" onclick="popup('${i}')" class="btn btn-info" style="margin:1px" data-toggle="modal" data-target="#myModal">`+i+`</button>&nbsp`
        }  
    })
    return  htmlContent;
}


function geneList() {
    var checkss = document.getElementById("genelist")
    let status = 1

    if (checkss.value == "") {
        genealer.innerHTML = '';
        var alerts = `<div class="alert alert-danger" role="alert" >`+'Gene list cant be empty'+`</div>`
        status = 0
        genealer.innerHTML += alerts
    
        return false;
    }

    for (var i = 0; i < (checkss.value.split(/[\s,]+/)).length; i++) {
        if (!checkss.value.split(/[\s,]+/)[i].match(/^[a-z0-9]+$/i)) {
            genealer.innerHTML = '';
            var alerts = `<div class="alert alert-danger" role="alert" >`+"Please enter valid gene name"+`</div>`
            status = 0
            genealer.innerHTML += alerts
            return false;
        }


    else{
        genealer.innerHTML = '';
        panelalert.innerHTML = '';
    }
    }
    if(status){
        wholesgenes=[]
        genenameing =[]
        if ( expanded = true){
            document.getElementById("selects").click();
            expanded = false;
        }
        
        
        var table = document.getElementById('tables')
        let gene_list = $('#genelist').val()
        $('#gene_list').prop("disabled", true);
        $('#gene_list').html(
            `Loading...`
          );
        $.ajax({
            
            type: 'POST',
            url: '/gene_name',
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify({'data':gene_list}),
            success: function(res){
                console.log("here")
                console.log(res)
                let gene_str = ''
                gene_list.map(function(gene){
                    gene_str+=`${gene},`
                })
                var tableHTML=`
                    <h2>Gene result table</h2>
                    <p>Gene of <b>${gene_str.substring(0,gene_str.length-1)}</b> hit in <b>${Object.keys(res).length}</b> gene panel</p>
                    <table id='myTable' class='display'>
                        <thead>
                            <tr>
                            <th>S.no</th>
                            <th>Genes</th>
                            <th>Mutation status</th>
                            <th>Gene count</th>
                            <th>Gene panel</th>
                            </tr>
                        </thead>
                        <tbody>`
                let number = 1
                let vencount = 0
                venndat = {}
                genenameing.push(gene_list)
                for (var genePanelName in res) {
                    
                    var dataObj = res[genePanelName];
                    // if(vencount<3){
                    //     venndat[genePanelName] = dataObj[1]
                    //     vencount++
                    // }
                    dataObj.map(function (eachMutation){
                        let muatation = eachMutation[0];
                        let genes = eachMutation[1]
                        let buttonGene=[]
                        let geneCount = genes.length

                        venndat[genePanelName] = genes

                        tableHTML+=`<tr>
                            <td>${number}</td>
                            <td style="position:relative;padding:30px;width:300px" id=genebuttonbox${number}>`

                            for (var geneIndex in genes){       
                                buttonGene.push(genes[geneIndex])
                                
                            }
                            for (var ge in genenameing[0]){
                                buttonGene = buttonGene.filter(v => v !== genenameing[0][ge] );
                                buttonGene.unshift(genenameing[0][ge])
                            }
                            
                            
                            wholesgenes.push(buttonGene)
    
                            tableHTML +=genePopulator(buttonGene.slice(0,genenameing[0].length))
                        //TODO show only search gene
                        // tableHTML +=genePopulator(buttonGene.slice(0,10))
                        tableHTML+=`
                        <div style='position:absolute; bottom:0;'>
                            <button  value="${number}" class="btn btn-sm btn-primary" onClick="showmore(this)" id="btn${number}">Show more</button>
                            <button  value="${number}"  class="btn btn-sm btn-primary" style="display:none"  onClick="showless(this)" id="bt${number}">Show less</button>
                            </div>
                            </td>
                            <td>${muatation}</td>
                            <td>${geneCount}</td>
                            <td>${genePanelName}</td>
                        </tr>`
                        number++
                       
                    })
                }
                table.innerHTML = tableHTML+"</tbody></table>";
                console.log(venndat)
                $('#myTable').DataTable()
                venndiagram(venndat, "gene list")
                $('#gene_list').html(`submit`);
                $('#gene_list').prop("disabled", false);
            }
        })

    }

}

function genePanel() {
    var checkBoxes = document.getElementsByName("gene_panels");
    var checklist = []
    var nbChecked = 0;
    for (var i = 0; i < checkBoxes.length; i++) {
        if (checkBoxes[i].checked) {
            checklist.push(checkBoxes[i].value)
            nbChecked++;
        };
    };
    if (nbChecked > 3) {
        
        panelalert.innerHTML = '';
        var alerts = `<div class="alert alert-danger" role="alert" >`+"You cannot select more than three genepanel names"+`</div>`
        panelalert.innerHTML += alerts
        // var child = document.createElement("p");
        // panelalert.appendChild(child);
        // child.after("You cannot select more than 3 genepanel names");
        return false;
    } else if (nbChecked <1) {
        panelalert.innerHTML = '';
        var alerts = `<div class="alert alert-danger" role="alert" >`+'Please, Check at two least  genepanel names!'+`</div>`
        panelalert.innerHTML += alerts
        
        return false;
    } 
    else{
        wholesgenes=[]
        genenameing=[]
        document.getElementById("selects").click();
        expanded = false;
        panelalert.innerHTML = '';
        genealer.innerHTML = '';
       var table = document.getElementById('tables')
        $.ajax({
            type: 'POST',
            url: '/gene_panel_list',
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify({'data':checklist}),
            success: function(res){
               var tableHTML=`
                <h2>Gene panel result table</h2>
                <p></p>
                <table id='myTable' style='outline: 4px solid black;' class='display'>
                    <thead>
                        <tr>
                            <th>S.no</th>
                            <th>Gene panel</th>
                            <th>Mutation status</th>
                            <th>Gene count</th>
                            <th>Genes</th>
                        </tr>
                    </thead>
                    <tbody>`
               let number = 1
               venndata = {}
               for (var gene_pane in res) {
                    var dataObj = res[gene_pane];
                    dataObj.map(function (eachMutation){
                        let muatation = eachMutation[0];
                        let genes = eachMutation[1]
                        let buttonGene=[]
                        let geneCount = genes.length

                        //venn
                        venndata[gene_pane]=genes


                        tableHTML+=`<tr><td>${number}</td><td>${gene_pane}</td><td>${muatation}</td><td>${geneCount}</td><td  style="position:relative;padding:30px"id=genebuttonbox${number}>`
                        for (var geneIndex in genes){
                            buttonGene.push(genes[geneIndex])
                        }
                        wholesgenes.push(buttonGene)

                        //show first ten gene
                        tableHTML +=genePopulator(buttonGene.slice(0,10))

                        tableHTML+=`<div style='position:absolute; bottom:0;'>
                            <button  value="${number}" class="btn btn-sm btn-primary" onClick="showmore(this)" id="btn${number}">Show more</button>
                            <button  value="${number}" class="btn btn-sm btn-primary" style="display:none"   onClick="showless(this)" id="bt${number}">Show less</button>
                            </div></td></tr>`

                        number++

                    })     
                }
                table.innerHTML = tableHTML+"</tbody></table>";
                $('#myTable').DataTable()
                venndiagram(venndata, 'gene panel')
            }
        })
    }
}

$.ajax({
    type: "GET",
    url: "/get_genes",
    success: function(data){
        let htmlcontern = ''
        data.map(function(value){
            htmlcontern+=`<option>${value}</option>`
        })
        genedrops.innerHTML = htmlcontern
        // this is for form remove orange white from form
        $(".form-control").select2({
            tags: true
        });
    },
    async: false
});


    
selectbox.onclick = function () {
    var checkboxes = document.getElementById("checkboxes");
    if (!expanded) {
        checkboxes.style.display = "block";
        expanded = true;
    } else {
        checkboxes.style.display = "none";
        expanded = false;
    }
}


$.ajax({
    type: "GET",
    url: "/gene_panel",
    success: function(data){
        
        for (var i = 0; i < data.length; i++) {
            
            var opt = data[i];
            checkboxdiv.innerHTML += `<label style="background-color: white;margin:0px;" for="` + i + `">
                <input type="checkbox" style="background-color: white;margin:5px;"  class="form-check-label" for="flexCheckDefault" name="gene_panels" id="`+ i + `" value="` + opt + `" />` + opt + `</label>`;
        }
    }
});




var chec = document.getElementsByName("gene_panels");
var checkboxe = document.getElementById("checkboxes");
checkboxe.onclick = function(){
    for (var i = 0 ; i < chec.length;i++){
        if (chec[i].checked) {
            console.log( checkboxe.getElementsByTagName('input')[0])
            checkboxe.getElementsByTagName('div')[0].prepend(chec[i].parentNode)    
            checkboxe.scrollTop = 0;       
        }    
       ;      
    }   
}


function filterFunction() {
    var input, filter, ul, li, a, i;
    input = document.getElementById("searchinput");
    filter = input.value.toUpperCase();
    div = document.getElementById("checkboxes");
    a = div.querySelectorAll('label')
    for (i = 0; i < a.length; i++) {
      txtValue = a[i].textContent || a[i].innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        a[i].style.display = "";
      } else {
        a[i].style.display = "none";
      }
    }
  }

  
  function showmore(e){
    var index_val=parseInt(e.value)
    var cout = document.getElementById("genebuttonbox"+index_val)
     var count = (cout.getElementsByTagName("button").length)-2;
     var bt = document.getElementById("bt"+index_val)
     var btn = document.getElementById("btn"+index_val)
     var wholes = (wholesgenes[e.value-1])
     console.log(count)
     console.log(wholes.length)
     bt.style.display="inline"
    
     if((count+10) < wholes.length){
        cout.innerHTML += genePopulator(wholes.slice(count,(count + 10)))      
        
     }
     if((count+10) >= wholes.length){
         cout.innerHTML = genePopulator(wholes.slice(0,(wholes.length)))
         cout.innerHTML +=`<div style='position:absolute; bottom:0; float: right ; '>
         <button style="display:none" value="`+index_val +`"  class="btn btn-sm btn-primary" onClick="showmore(this)" id="btn`+index_val +`">Show more</button>
         <button   value="`+index_val +`"   class="btn btn-sm btn-primary" onClick="showless(this)" id="bt`+index_val +`">Show less</button>`
         
     }  
   };
 
 
  function showless(e){
 
     var index_val=parseInt(e.value)
     var cout = document.getElementById("genebuttonbox"+index_val)
      var count = (cout.getElementsByTagName("button").length)-2;
      console.log(count)
      var bt = document.getElementById("bt"+index_val)
      var btn = document.getElementById("btn"+index_val)
      var wholes = (wholesgenes[e.value-1])
      console.log(wholes.length)
     if((count -10) >= 10){
         cout.innerHTML = genePopulator(wholes.slice(0 ,(count - 10)))
         cout.innerHTML +=`<div style='position:absolute; bottom:0; float: right ;'>
         <button  value="`+index_val +`" class="btn btn-sm btn-primary" onClick="showmore(this)" id="btn`+index_val +`">Show more</button>
         <button   value="`+index_val +`"  class="btn btn-sm btn-primary"  onClick="showless(this)" id="bt`+index_val +`">Show less</button>`
        
         
        }
        if((count -10) <= 10){
         cout.innerHTML = genePopulator(wholes.slice(0 ,10))
         cout.innerHTML +=`<div style='position:absolute; bottom:0; float: right ;'>
         <button  value="`+index_val +`" class="btn btn-sm btn-primary" onClick="showmore(this)" id="btn`+index_val +`">Show more</button>
         <button style="display:none"  value="`+index_val +`"  class="btn btn-sm btn-primary"  onClick="showless(this)" id="bt`+index_val +`">Show less</button>`
 
        //  bt.disabled=true
        //  btn.disabled=false
        }
     };




