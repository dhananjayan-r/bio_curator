import csv
import json

from flask.json import jsonify

class TSV:
    def __init__(self, filename):
        self.data = {}
        self.gene = {}
        self._fileConversion(filename)
        self._savePanelFile()
        self._makeGene()
        self._saveGeneFile()

    def _remove(self,gene_list,by=''):
        try:
            while True:
                gene_list.remove(by)
        except:
            return gene_list
        

    def _fileConversion(self, filename, delimiter='\t'):
        with open(filename) as csv_file:
            csv_reader = csv.reader(csv_file, delimiter=delimiter)
            line = 0
            for row in csv_reader:
                panel_name = row[14]
                gene = list(set((row[18].replace('-','') + row[19].replace('-','')).split(','))) #combin both primary gene, secondary gene and split by ','
                gene = self._remove(gene)
                mutation_status = row[8]
                if line != 0:
                    if panel_name != "":
                        if panel_name in self.data:
                            self.data[panel_name].append([mutation_status, gene])
                        else:
                            self.data[panel_name] = [[mutation_status, gene]]
                line=1

    def _makeGene(self):
        for key in self.data.keys():
            for set in self.data[key]:
                status = set[0]
                for value in set[1]:
                    if value in self.gene:
                        self.gene[value].append([key,status])
                    else:
                        self.gene[value] = [[key,status]]

    def _savePanelFile(self):
        panel_file = open('flat_data/gene_panel.json','w')
        json.dump(self.data, panel_file)
        panel_file.close()



    def _saveGeneFile(self):
        gene_file = open('flat_data/gene.json','w')
        json.dump(self.gene, gene_file)
        gene_file.close()
