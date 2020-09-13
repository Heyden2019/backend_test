"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (req, res, next) => {
    if (req.session.userId) {
        return next();
    }
    res.sendStatus(401);
};
//# sourceMappingURL=isAuthenticated.js.map