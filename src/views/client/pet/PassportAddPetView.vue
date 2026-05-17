<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// 1. 定義表單資料結構 (對應 C# Model 欄位)
const form = reactive({
  name: '',
  type: '',      // 貓、犬...
  breed: '',     // 品種
  gender: '公',  // 預設公
  birthday: '',
  chipId: '',
  weight: '',
  isNeutered: '已絕育'
});

// 2. 模擬下拉選單資料
const petTypes = ['犬', '貓', '兔', '其他'];
const breeds = {
  '犬': ['柯基', '柴犬', '黃金獵犬', '米克斯'],
  '貓': ['美短', '布偶貓', '波斯貓', '米克斯']
};

// 3. 提交表單
const submitForm = () => {
  console.log('提交寵物資料：', form);
  // 這裡之後會接 axios.post('/api/Pet', form)
  alert('建立成功！');
  router.push('/healthpassport'); // 導回護照主頁
};

// 4. 關閉頁面
const closePage = () => {
  router.back();
};
</script>

<template>
  <div class="min-h-screen bg-[#F7F3F1] py-4 px-6 relative">
    <div class="flex justify-center items-center mb-8 relative">
      <h1 class="text-xl font-bold text-gray-700">建立寵物資料</h1>
      <button @click="closePage" class="absolute right-0 text-gray-400 hover:text-gray-600">
        <i class="fa-solid fa-xmark text-2xl"></i>
      </button>
    </div>

    <div class="max-w-xl mx-auto space-y-6">
      
      <div>
        <label class="block text-[#9C6D6D] font-bold mb-2">寵物姓名 <span class="text-red-500">*</span></label>
        <input 
          v-model="form.name"
          type="text" 
          placeholder="請輸入姓名"
          class="w-full border-none rounded-2xl p-4 bg-white shadow-sm focus:ring-2 focus:ring-[#9C6D6D] outline-none"
        />
      </div>

      <div>
        <label class="block text-gray-500 font-bold mb-2">寵物的種類</label>
        <select 
          v-model="form.type"
          class="w-full border-none rounded-2xl p-4 bg-white shadow-sm focus:ring-2 focus:ring-[#9C6D6D] outline-none appearance-none cursor-pointer"
        >
          <option value="" disabled>請選擇</option>
          <option v-for="type in petTypes" :key="type" :value="type">{{ type }}</option>
        </select>
      </div>

      <div>
        <label class="block text-gray-500 font-bold mb-2">品種</label>
        <select 
          v-model="form.breed"
          class="w-full border-none rounded-2xl p-4 bg-white shadow-sm focus:ring-2 focus:ring-[#9C6D6D] outline-none appearance-none cursor-pointer"
        >
          <option value="" disabled>請選擇</option>
          <option v-for="breed in breeds[form.type] || []" :key="breed" :value="breed">{{ breed }}</option>
        </select>
      </div>

      <div>
        <label class="block text-gray-500 font-bold mb-2">寵物性別</label>
        <div class="flex gap-6 mt-3">
          <label v-for="gender in ['公', '母', '未知']" :key="gender" class="flex items-center gap-2 cursor-pointer">
            <input type="radio" v-model="form.gender" :value="gender" class="w-5 h-5 accent-[#9C6D6D]">
            <span class="text-gray-600">{{ gender }}</span>
          </label>
        </div>
      </div>

      <div>
        <label class="block text-gray-500 font-bold mb-2 text-sm">出生日期</label>
        <div class="relative">
          <input 
            v-model="form.birthday"
            type="date" 
            class="w-full border-none rounded-2xl p-4 bg-white shadow-sm focus:ring-2 focus:ring-[#9C6D6D] outline-none text-gray-400"
          />
        </div>
      </div>

      <div>
        <label class="block text-gray-500 font-bold mb-1 flex items-center gap-1">
          晶片ID <i class="fa-regular fa-circle-question text-xs"></i>
        </label>
        <input 
          v-model="form.chipId"
          type="text" 
          class="w-full border-none rounded-2xl p-4 bg-white shadow-sm focus:ring-2 focus:ring-[#9C6D6D] outline-none"
        />
      </div>

      <div>
        <label class="block text-gray-500 font-bold mb-2">體重</label>
        <div class="relative">
          <input 
            v-model="form.weight"
            type="number" 
            class="w-full border-none rounded-2xl p-4 bg-white shadow-sm focus:ring-2 focus:ring-[#9C6D6D] outline-none"
          />
          <span class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">KG</span>
        </div>
      </div>

      <div>
        <label class="block text-gray-500 font-bold mb-2">絕育狀況</label>
        <div class="flex gap-6 mt-3">
          <label v-for="status in ['已絕育', '未絕育']" :key="status" class="flex items-center gap-2 cursor-pointer">
            <input type="radio" v-model="form.isNeutered" :value="status" class="w-5 h-5 accent-[#9C6D6D]">
            <span class="text-gray-600">{{ status }}</span>
          </label>
        </div>
      </div>

      <div class="pt-6 pb-12">
        <button 
          @click="submitForm"
          class="w-32 bg-[#B59891] text-white py-3 rounded-full text-lg font-bold shadow-lg hover:bg-[#9C6D6D] transition"
        >
          完成
        </button>
      </div>

    </div>
  </div>
</template>

<style scoped>
/* 針對 Webkit 瀏覽器 (Chrome, Edge, Safari) 強制顯示日曆圖示 */
input[type="date"]::-webkit-calendar-picker-indicator {
  display: block;
  cursor: pointer;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="15" viewBox="0 0 24 24"><path fill="%239C6D6D" d="M20 3h-1V1h-2v2H7V1H5v2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 18H4V8h16v13z"/></svg>');
  /* 如果不想用上面的自訂圖示，可以只寫下面這行 */
  opacity: 1;
}
</style>