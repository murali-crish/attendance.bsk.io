import {setScanFeedback} from './scanner.js'
import {supabaseClient} from "../shared/supabase.js";

export async function loadAttendance() {
    console.log('Load Attendance');
    const list = document.getElementById('attendance-list');
    if (!list) return;

    const { data, error } = await supabaseClient
        .from('attendance')
        .select('created_at, students(name)')
        .order('created_at', { ascending: false })
        .limit(20);

    if (data) {
        list.innerHTML = data.map(entry => `
            <div class="glass-card p-4 rounded-2xl flex justify-between items-center animate-in fade-in slide-in-from-bottom-2 duration-500 bg-white shadow-sm border border-slate-100">
                <div>
                    <p class="font-bold text-slate-800">${entry.students.name}</p>
                    <p class="text-[10px] text-slate-400 uppercase tracking-widest">${new Date(entry.created_at).toLocaleTimeString()}</p>
                </div>
                <div class="bg-emerald-100 text-emerald-600 p-2 rounded-full">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                    </svg>
                 </div>
            </div>
            `).join('');
    }
}

export async function recordAttendance(studentId, scannedPhone, studentName) {
    const { error } = await supabaseClient
        .from('attendance')
        .insert([{ student_id: studentId, scanned_phone: scannedPhone }]);
    if (!error) {
        setScanFeedback(`Checked in: ${studentName}`);
    } else {
        setScanFeedback('Attendance not recorded', true);
    }
}