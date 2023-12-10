class Models{
    constructor(table){ this.table = table }
    async getFull(filter={}, select='', sort={'created':-1}){ return await this.table.find(filter).select(select).sort(sort).exec() }
    async getList(filter={}, select='', limit=10, skip=0, sort={'created':-1}){
        return await this.table.find(filter, {content: 0, __v: 0}).select(select).sort(sort).skip(skip).limit(limit).exec() }
    async getDetail(obj={}, sort={'created':-1}, limit=1){ return await this.table.find(obj).sort(sort).limit(limit).exec() }
    async delete(obj={}){ return await this.table.deleteMany(obj)}
    async create(body){ return await this.table.create(body) }
    async update(id={}, value={}){ return await this.table.updateMany(id, value) }
}
module.exports = Models;