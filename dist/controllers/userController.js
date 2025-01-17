"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfile = void 0;
const server_1 = require("../server");
const zod_1 = require("zod");
const profileSchema = zod_1.z.object({
    name: zod_1.z.string().min(2).optional(),
    bio: zod_1.z.string().optional()
});
const updateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, bio } = profileSchema.parse(req.body);
        const updatedUser = yield server_1.prisma.user.update({
            where: {
                id: req.user.id
            },
            data: {
                name: name,
                bio: bio
            }
        });
        res.json(updatedUser);
    }
    catch (error) {
        res.status(400).json({ message: 'Invalid input' });
    }
});
exports.updateProfile = updateProfile;
