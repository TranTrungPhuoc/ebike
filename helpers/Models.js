class Models{
    constructor(table){ this.table = table }
    async getFull(filter={}, select=''){ return await this.table.find(filter).select(select).exec() }
    async getList(filter={}, select='', limit=10, skip=0){ 
        return await this.table.find(filter).select(select).sort({'created':-1}).limit(limit).skip(skip).exec() }
    async getDetail(obj={}){ return await this.table.find(obj).exec() }
    async delete(obj={}){ return await this.table.deleteMany(obj)}
    async create(body){ return await this.table.create(body) }
    async update(id={}, value={}){ return await this.table.updateMany(id, value) }
}
module.exports = Models;