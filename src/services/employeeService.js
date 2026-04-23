import api from './api'

const parseDate = (d) => {
  if (!d) return ''
  return d.slice(0, 10) // "2026-04-10T00:00:00" → "2026-04-10"
}

// Backend dùng employeeName/gender(0,1) — map sang fullName/gender('male','female') cho UI
const toBackend = (c) => ({
  employeeId:   c.employeeId,
  employeeCode: c.employeeCode || `NV${Date.now()}`,
  employeeName: c.fullName || '',
  age:          Number(c.age) || 0,
  gender:       c.gender === 'male' ? 0 : c.gender === 'female' ? 1 : null,
  createdDate:  c.createdDate || new Date().toISOString(),
  createdBy:    c.createdBy || '',
  modifiedDate: new Date().toISOString(),
  modifiedBy:   c.modifiedBy || '',
  phoneNumber:     c.phoneNumber     || null,
  email:           c.email           || null,
  country:         c.country         || null,
  province:        c.province        || null,
  ward:            c.ward            || null,
  address:         c.address         || null,
  candidateSource: c.candidateSource || null,
  recentWorkplace: c.recentWorkplace || null,
  recruiter:       c.recruiter       || null,
  educationLevel:  c.educationLevel  || null,
  educationPlace:  c.educationPlace  || null,
  major:           c.major           || null,
  dob:             c.dob             ? c.dob.slice(0, 10) : '',
  applicationDate: c.applicationDate ? new Date(c.applicationDate).toISOString() : null,
  avatar:          c.avatar          || null,
  cv:     c.cv?.dataUrl || null,
})

const toFrontend = (e) => {
  const result = {
    ...e,
    fullName:        e.employeeName,
    gender:          e.gender === 0 ? 'male' : e.gender === 1 ? 'female' : '',
    dob:             parseDate(e.dob),
    applicationDate: parseDate(e.applicationDate),
    cv:              e.cv ? { dataUrl: e.cv, type: 'application/pdf', name: 'CV', size: '' } : null,
  }

  return result
}

export const employeeService = {
  // tìm kiếm + filter
  async search(keyword = '', pageIndex = 1, pageSize = 10, filters = []) {
    const { data } = await api.post('/Employee/search', { keyword, pageIndex, pageSize, filters })
    return { ...data, data: data.data.map(toFrontend) }
  },

  // thêm nhân viên
  async insert(c)      { return (await api.post('/Employee', toBackend(c))).data },

  // Sửa nhân viên
  async update(c)      { return (await api.put('/Employee', toBackend(c))).data },

  // Xóa nhân viên theo ID
  async deleteById(id) { return (await api.delete(`/Employee/${id}`)).data },

  // Xóa nhiều nhân viên theo ID
  async deleteMultiple(ids) { return (await api.delete('/Employee', { data: ids })).data },
}
