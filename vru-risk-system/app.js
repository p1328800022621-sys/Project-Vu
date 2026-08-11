// กำหนดค่าการเชื่อมต่อ Supabase
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_KEY = 'YOUR_SUPABASE_ANON_KEY';
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// ฟังก์ชันดึงปีการศึกษาที่เปิดใช้งาน
async function loadActiveYear() {
    const { data, error } = await supabase
        .from('academic_years')
        .select('*')
        .eq('is_active', true)
        .single();

    const container = document.getElementById('year-status');
    if (error || !data) {
        container.innerHTML = `<p style="color:red">ไม่มีปีการศึกษาที่เปิดให้กรอกข้อมูล</p>`;
    } else {
        container.innerHTML = `<h3>ปีการประเมินปัจจุบัน: ${data.year_name} (สถานะ: เปิดให้กรอก/แก้ไข)</h3>`;
    }
}

// ฟังก์ชันดึงโครงสร้างฟอร์มที่ Admin ตั้งค่าไว้
async function loadFormFields() {
    const { data, error } = await supabase
        .from('field_configs')
        .select('*')
        .order('display_order', { ascending: true });

    const container = document.getElementById('form-fields');
    if (error) {
        container.innerHTML = 'เกิดข้อผิดพลาดในการโหลดฟอร์ม';
        return;
    }

    let html = '';
    data.forEach(field => {
        html += `<div class="card">`;
        html += `<label><b>${field.field_name}</b></label><br>`;
        
        if (field.field_type === 'select') {
            const options = field.options.split(',');
            html += `<select id="field_${field.id}">`;
            options.forEach(opt => {
                html += `<option value="${opt.trim()}">${opt.trim()}</option>`;
            });
            html += `</select>`;
        } else {
            html += `<input type="text" id="field_${field.id}" placeholder="กรอกข้อมูล..." style="width: 80%;">`;
        }
        
        html += `</div>`;
    });

    container.innerHTML = html;
}

// เรียกทำงานเมื่อโหลดหน้าเว็บ
loadActiveYear();
loadFormFields();