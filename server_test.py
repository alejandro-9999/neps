from flask import Flask, jsonify, request  # Importar "request"
from flask_cors import CORS
from faker import Faker
import math


app = Flask(__name__)

# Habilitar CORS para toda la aplicación
CORS(app)

# Datos ficticios de ubicación
location_data = {
    "regions": ["Norte", "Sur", "Este", "Oeste"],
    "zones": ["Zona 1", "Zona 2", "Zona 3", "Zona 4"]
}


fake = Faker()



@app.route('/api/consulta/ubicacion', methods=['GET'])
def get_location_data():
    # Simula la respuesta de los datos de ubicación
    return jsonify(location_data)

# Generar datos ficticios
def generate_fake_data(num_records):
    data = []
    for _ in range(num_records):
        record = {
            "nit_ips": fake.random_number(digits=10, fix_len=True),
            "ips": fake.company(),
            "regional": fake.random_element(elements=("Norte", "Sur", "Este", "Oeste")),
            "zonal": fake.random_element(elements=("Zona 1", "Zona 2", "Zona 3", "Zona 4")),
            "departamento": fake.state(),
            "numero_identificacion_afiliado": fake.random_number(digits=10, fix_len=True),
            "nombres_y_apellidos": fake.name(),
            "fecha_ingreso": fake.date_between(start_date='-2y', end_date='today').strftime('%Y-%m-%d'),
            "dx_ingreso": fake.random_element(elements=["A00", "B01", "C02"]),
            "codigo_mapiiss": fake.random_element(elements=["001", "002", "003"]),
            "cohorte": fake.random_element(elements=["Cohorte 1", "Cohorte 2"]),
            "infeccion_asociada_al_cuidado_de_la_salud": fake.random_element(elements=[True, False]),
            "eventos_adverso_1": fake.random_element(elements=[True, False]),
            "fecha_egreso": fake.date_between(start_date='-1y', end_date='today').strftime('%Y-%m-%d'),
            "condicion_alta": fake.random_element(elements=["Recuperado", "En tratamiento", "Fallecido"]),
            "numerofactura": fake.random_number(digits=8, fix_len=True),
            "valorfactura": fake.random_number(digits=6),
            "valorglosado": fake.random_number(digits=5),
            "descripcionglosageneral": fake.sentence()
        }
        data.append(record)
    return data

# Datos aleatorios pre-generados
fake_data = generate_fake_data(100)

@app.route('/api/consulta/reportes', methods=['POST'])
def get_reportes():
    # Obtener los parámetros del body de la solicitud POST
    data = request.json
    start_date = data.get('startDate')
    end_date = data.get('endDate')
    nit_ips = data.get('nitIps')
    numero_afiliado = data.get('numeroAfiliado')
    regional = data.get('regional')
    zonal = data.get('zonal')
    regimen = data.get('regimen')

    # Parámetros de paginación
    page = int(data.get('page', 1))
    size = int(data.get('size', 10))

    # Filtrar los datos
    filtered_data = [record for record in fake_data if (
        (not start_date or record["fecha_ingreso"] >= start_date) and
        (not end_date or record["fecha_ingreso"] <= end_date) and
        (not nit_ips or str(record["nit_ips"]) == nit_ips) and
        (not numero_afiliado or str(record["numero_identificacion_afiliado"]) == numero_afiliado) and
        (not regional or record["regional"].startswith(regional)) and
        (not zonal or record["zonal"].startswith(zonal))
    )]

    # Total de registros filtrados
    total_records = len(filtered_data)
    total_pages = math.ceil(total_records / size)

    # Aplicar paginación
    start_index = (page - 1) * size
    end_index = start_index + size
    paginated_data = filtered_data[start_index:end_index]

    # Respuesta con paginación
    response = {
        "cantidadRegistros": total_records,
        "totalPaginas": total_pages,
        "paginaActual": page,
        "amconcurrencias": paginated_data,
        "codigo": "200"
    }

    return jsonify(response)

if __name__ == '__main__':
    app.run(debug=True, port=8082)
