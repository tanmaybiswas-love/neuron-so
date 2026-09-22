import urllib.request, json, time, subprocess, sys

print("Starting server...", flush=True)
proc = subprocess.Popen(['node', 'src/server.js'], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
time.sleep(2)

try:
    print("Sending request to /api/system-info...", flush=True)
    res = urllib.request.urlopen('http://localhost:3000/api/system-info')
    data = json.loads(res.read().decode('utf-8'))
    print("API SUCCESS:", data, flush=True)
except Exception as e:
    print("ERROR:", e, flush=True)
    stdout, stderr = proc.communicate(timeout=2)
    print("NODE STDOUT:", stdout.decode(), flush=True)
    print("NODE STDERR:", stderr.decode(), flush=True)
finally:
    proc.terminate()
