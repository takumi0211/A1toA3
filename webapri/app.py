# -*- coding: utf-8 -*-
from flask import Flask, render_template, request, send_file
from werkzeug.utils import secure_filename
from PyPDF2 import PdfReader, PdfWriter
import os

app = Flask(__name__)

def split_a1_to_six_parts(input_pdf_path, output_pdf_prefix):
    with open(input_pdf_path, 'rb') as input_file:
        pdf_reader = PdfReader(input_file)

        a1_width = (841 / 25.4) * 72
        a1_height = (594 / 25.4) * 72

        num_splits_x, num_splits_y = 3, 2
        a1_width_split, a1_height_split = a1_width / num_splits_x, a1_height / num_splits_y

        for j in range(num_splits_x):
            for i in range(num_splits_y):
                x_start, x_end = j * a1_width_split, (j + 1) * a1_width_split + 47
                y_start, y_end = i * a1_height_split, (i + 1) * a1_height_split + 47

                output_pdf_path = f"{output_pdf_prefix}_split_y{i}_x{j}.pdf"

                pdf_writer = PdfWriter()
                pdf_writer.add_page(pdf_reader.pages[0])
                pdf_writer.pages[0].mediabox.lower_left = (x_start, y_start)
                pdf_writer.pages[0].mediabox.upper_right = (x_end, y_end)

                with open(output_pdf_path, 'wb') as output_file:
                    pdf_writer.write(output_file)

    return output_pdf_prefix

def merge_pdfs(input_paths, output_path):
    pdf_writer = PdfWriter()

    for input_path in input_paths:
        with open(input_path, 'rb') as pdf_file:
            pdf_reader = PdfReader(pdf_file)
            pdf_writer.add_page(pdf_reader.pages[0])

    with open(output_path, 'wb') as output_file:
        pdf_writer.write(output_file)

def split_and_merge_pdf_interface(input_pdf_path):
    output_dir = "output_pdfs"
    os.makedirs(output_dir, exist_ok=True)
    output_prefix = os.path.join(output_dir, "output")

    with open(input_pdf_path, 'rb') as input_file:
        pdf_reader = PdfReader(input_file)

    result_prefix = split_a1_to_six_parts(input_pdf_path, output_prefix)

    output_files = [f"{result_prefix}_split_y{i}_x{j}.pdf" for i in range(2) for j in range(3)]

    merged_output_path = os.path.join(output_dir, "split_and_merge_file.pdf")
    merge_pdfs(output_files, merged_output_path)

    return merged_output_path

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return render_template('index.html', error='ファイルがありません')

    file = request.files['file']

    if file.filename == '':
        return render_template('index.html', error='ファイルが選択されていません')

    if file:
        filename = secure_filename(file.filename)
        input_path = os.path.join("uploads", filename)
        file.save(input_path)

        output_pdf_path = split_and_merge_pdf_interface(input_path)

        return send_file(output_pdf_path, as_attachment=True)

if __name__ == "__main__":
    os.makedirs("uploads", exist_ok=True)
    app.run()