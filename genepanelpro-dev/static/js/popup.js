function popup(gene){
        $('#modeltitle').html('<center><b> '+ gene +'</b></center>');
        link ="https://www.genenetwork.nl/api/v1/gene/".concat(gene);
        $('#ff').html("<center>Please wait...</center>");
         $.getJSON(link, function(jd) {
                if(Object.keys(jd)[0] == 404){
                    genedata = `Gene details not found`
                }
                else{
         		data = jd["gene"]
         		genedata = ``
				genedata += `<tr><td width="140"><b>Description:</b></td><td style ="word-break:break-all;">${data['description']}</td></tr><br>`
				genedata += `<tr><td width="140"><b>Type:</b></td><td style ="word-break:break-all;">${data['biotype'].replace('_',' ')}</td></tr><br>`
				genedata += `<tr><td width="170"><b>Chromosome Coordinate:</b></td><td style ="word-break:break-all;">chr${data['chr']}:${data['start']}-${data['stop']}</td></tr><br>`
				if(data['strand']==1){
				    genedata += `<tr><td width="140"><b>Strand:</b></td><td style ="word-break:break-all;">Positive</div><tr><br>`
				}else{
				    genedata += `<tr><td width="140"><b>Strand:</b></td><td style ="word-break:break-all;">Negative</td></tr><br>`
				}
                genedata += `<tr><td width="140"><b>Assembly release:</b></td><td style ="word-break:break-all;">${data['assemblyRelease']}</td></tr><br>`
                genedata += `<tr><td width="140"><b>Biomart release:</b></td><td style ="word-break:break-all;">${data['biomartRelease']}</td></tr><br>`

                var text = "";
                trans = data['transcripts']
                for (let i = 0; i < trans.length; i++) {
                    text += trans[i] + ",&nbsp;";
                 }

                genedata += `<tr><td width="140"><b>Transcripts:</b></td><td style ="word-break:break-all;">${text}</td></tr>`
                }
                $('#ff').html(genedata);

               });
    }
