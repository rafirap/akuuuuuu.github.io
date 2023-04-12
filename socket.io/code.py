
import socketio
import os

# Inisialisasi socketio server
sio = socketio.Server()

# Fungsi untuk memproses kode
def prosesKode(kode):
    # Lakukan pengolahan pada kode, contoh hanya menambahkan pesan "Halo Dunia!" pada akhir kode
    hasil = kode + ' Halo Dunia!'
    return hasil

@sio.event
def connect(sid, environ):
    print('Client terhubung:', sid)

# Menangani event 'DeobPiterP'
@sio.on('DeobPiterP')
def on_deob_piter_p(sid, data):
    hasil = prosesKode(data)
    sio.emit('hasil', hasil)

if __name__ == '__main__':
    # Gunakan WSGI untuk menjalankan server socketio pada direktori
    current_directory = os.path.dirname(os.path.abspath(__file__))
    app = socketio.WSGIApp(sio)
    eventlet.wsgi.server(eventlet.listen(('localhost', 3000)), app, log_output=False,
            environ={'SCRIPT_NAME': '/python_workspace/', 'PATH_INFO': os.path.relpath(current_directory, '/path/to/workspace/')})

