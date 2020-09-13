"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (req, res, next) => {
    if (req.session.userId === req.params.id) {
        return next();
    }
    res.sendStatus(403);
};
//# sourceMappingURL=isMe.js.map