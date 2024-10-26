import React, { useState } from 'react';
import { X } from 'lucide-react';
import './styles/StaffModal.css';

const StaffModal = ({ isOpen, onClose, onSave, editData = null }) => {
 const [formData, setFormData] = useState(editData || {
   name: '',
   role: '전문의',
   department: '응급의학과',
   email: ''
 });

 const handleSubmit = (e) => {
   e.preventDefault();
   onSave(formData);
 };

 const handleChange = (e) => {
   const { name, value } = e.target;
   setFormData(prev => ({
     ...prev,
     [name]: value
   }));
 };

 if (!isOpen) return null;

 return (
   <div id="staffModal" className="admin-modal">
     <div className="admin-modal-content">
       <div className="admin-modal-header">
         <h3>{editData ? '의료진 정보 수정' : '의료진 추가'}</h3>
         <button className="admin-modal-close" onClick={onClose}>
           <X className="icon" />
         </button>
       </div>

       <form className="admin-modal-form" onSubmit={handleSubmit}>
         <div className="admin-form-group">
           <label htmlFor="name">이름</label>
           <input
             type="text"
             id="name"
             name="name"
             value={formData.name}
             onChange={handleChange}
             required
           />
         </div>

         <div className="admin-form-group">
           <label htmlFor="role">직책</label>
           <select
             id="role"
             name="role"
             value={formData.role}
             onChange={handleChange}
             required
           >
             <option value="전문의">전문의</option>
             <option value="레지던트">레지던트</option>
             <option value="인턴">인턴</option>
             <option value="간호사">간호사</option>
           </select>
         </div>

         <div className="admin-form-group">
           <label htmlFor="department">부서</label>
           <select
             id="department"
             name="department"
             value={formData.department}
             onChange={handleChange}
             required
           >
             <option value="응급의학과">응급의학과</option>
             <option value="내과">내과</option>
             <option value="외과">외과</option>
           </select>
         </div>

         <div className="admin-form-group">
           <label htmlFor="email">이메일</label>
           <input
             type="email"
             id="email"
             name="email"
             value={formData.email}
             onChange={handleChange}
             required
           />
         </div>

         <div className="admin-modal-actions">
           <button type="button" className="admin-modal-cancel" onClick={onClose}>
             취소
           </button>
           <button type="submit" className="admin-modal-save">
             저장
           </button>
         </div>
       </form>
     </div>
   </div>
 );
};

export default StaffModal;