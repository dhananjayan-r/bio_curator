import json
from models.TSV import TSV
from flask import Flask, render_template, url_for, redirect, jsonify, request


app = Flask(__name__, static_url_path='/static')

gene_panel_json = {}
gene_json = {}


def creatFlatFile(filename='Gene_Panel_v10.2.tsv'):
    global gene_panel_json, gene_json
    obj = TSV(filename)
    del obj
    gene_panel_file = open('flat_data/gene_panel.json', 'r')
    gene_file = open('flat_data/gene.json', 'r')

    gene_panel_json = json.loads(gene_panel_file.read())
    gene_json = json.loads(gene_file.read())

    gene_panel_file.close()
    gene_file.close()


@app.route("/gene_panel")
def gene_panel():
    res = list(gene_panel_json.keys())
    return jsonify(res)


@app.route("/gene_panel_list", methods=['POST'])
def gene_panel_table():
    query = json.loads(request.data)

    res = {}
    for key in query['data']:
        key = key.replace('©', '&copy;')
        res[key] = gene_panel_json[key]

    return jsonify(res)


@app.route("/get_genes")
def get_genes():
    res = list(gene_json.keys())
    return jsonify(res)


@app.route("/gene_name", methods=['POST'])
def gene_name():
    query = json.loads(request.data)
    res = {}
    for gene in query['data']:
        gene_panel = gene_json[gene]
        for value in gene_panel:
            panel = value[0]
            status = value[1]
            res[panel] = []
            for i in gene_panel_json[panel]:
                if i[0] == status:
                    res[panel].append(i)
    return jsonify(res)


@app.route("/")
def home():
    return render_template("index.html")


if __name__ == '__main__':
    creatFlatFile()
    app.run(debug=True)
