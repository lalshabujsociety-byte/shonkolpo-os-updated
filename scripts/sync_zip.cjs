const { execSync } = require('child_process');
const fs = require('fs');

const pyScript = `
import zipfile, os, shutil

zip_path = "public/assets/aistudio/sonkolpo-os-v4-updated__1__e93aa813.zip"
temp_dir = "/tmp/sonkolpo_sync_tmp"

if os.path.exists(temp_dir):
    shutil.rmtree(temp_dir)
os.makedirs(temp_dir)

if os.path.exists(zip_path):
    with zipfile.ZipFile(zip_path, 'r') as zf:
        zf.extractall(temp_dir)

# Update app.js and index.html in extracted www/
shutil.copyfile("public/app.js", os.path.join(temp_dir, "www", "app.js"))
shutil.copyfile("public/index.html", os.path.join(temp_dir, "www", "index.html"))

# Ensure vendor folder exists
os.makedirs(os.path.join(temp_dir, "www", "vendor"), exist_ok=True)
for item in os.listdir("public/vendor"):
    src_v = os.path.join("public/vendor", item)
    dst_v = os.path.join(temp_dir, "www", "vendor", item)
    if os.path.isfile(src_v):
        shutil.copyfile(src_v, dst_v)

# Re-create zip cleanly
tmp_zip = "/tmp/sonkolpo_updated.zip"
if os.path.exists(tmp_zip):
    os.remove(tmp_zip)

with zipfile.ZipFile(tmp_zip, 'w', zipfile.ZIP_DEFLATED) as zf:
    for root, dirs, files in os.walk(temp_dir):
        for f in files:
            full_path = os.path.join(root, f)
            arcname = os.path.relpath(full_path, temp_dir)
            zf.write(full_path, arcname)

shutil.move(tmp_zip, zip_path)
shutil.rmtree(temp_dir)
print("Zip successfully synced!")
`;

fs.writeFileSync('/tmp/sync.py', pyScript);
try {
  const out = execSync('python3 /tmp/sync.py', { encoding: 'utf-8' });
  console.log(out);
} catch (e) {
  console.error(e.message);
}
