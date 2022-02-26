export const HttpPathAuthNotRequire: { [k: string]: any } = {
    "/v1/content": { method: ["GET"] },
    "/v1/content/search": { method: ["GET"] },
    "/v1/category": { method: ["GET"] },
    "/v1/version": { method: ["GET"] },
    "/v1/skills": { method: ["GET"] },
    "/v1/squidexarticles": { method: ["GET"] },
    "/stage/v1/squidexarticle/{slug}": { method: ["GET"] },
    "/v1/view": { method: ["POST"] }

}

export const HttpPathAdminRequire: { [k: string]: any } = {
    "/v1/version": { method: ["POST"] },
    "/v1/admin/content": { method: ["POST", "GET"] },
    "/v1/admin/content/{id}": { method: ["PUT"] }
}