import { ModelRouter } from '../common/model-router'
import * as restify from 'restify'
import { User } from './users.model'



class UserRouter extends ModelRouter<User> {
    
    constructor() {
        super(User)
        this.on('beforeRender', document => {
            // delete document.password // outra opção
            document.password = undefined
        })
    }

    findByEmail = (req, resp, next) => {
        if (req.query.email) {
            User.findByEmail(req.query.email)
                .then(user => {
                    if (user) {
                        return [user]
                    } else {
                        []
                    }
                })
                .then(this.renderAll(resp, next))
                .catch(next)
        } else {
            next()
        }
    }

    applyRoutes(application: restify.Server) {
        application.get({ path: `${this.basePath}`, version: '2.0.0' }, [this.findByEmail, this.findAll])
        application.get({ path: `${this.basePath}`, version: '1.0.0' }, this.findAll)
        application.get(`${this.basePath}/:id`, [this.validadeId, this.findById])
        application.post(`${this.basePath}`, this.save)
        application.put(`${this.basePath}:id`, [this.validadeId, this.replace]) 
        application.patch(`${this.basePath}:id`, [this.validadeId, this.update])
        application.del(`${this.basePath}:id`, [this.validadeId, this.delete])
    }
}

export const usersRouter = new UserRouter()