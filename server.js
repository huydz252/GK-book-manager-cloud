const express = require('express');
const { engine } = require('express-handlebars');
const { BookReadModel, BookWriteModel } = require('./db');
const sessionMiddleware = require('./sessionConfig');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

const MSSV = "23IT109";
const STUDENT_PREFIX = MSSV.slice(-3); 
const LAST_DIGIT = parseInt(MSSV.slice(-1)); 
const VAT_RATE = LAST_DIGIT + 5;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(sessionMiddleware);

// Handlebars Engine
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');


app.get('/', async (req, res) => {
    try {
        // Chỉ dùng BookReadModel
        const books = await BookReadModel.find().lean();
        
        const error = req.session.errorMessage;
        const success = req.session.successMessage;
        req.session.errorMessage = null;
        req.session.successMessage = null;

        res.render('index', {
            books,
            error,
            success,
            studentPrefix: STUDENT_PREFIX,
            vatRate: VAT_RATE
        });
    } catch (err) {
        res.status(500).send("Lỗi đọc dữ liệu: " + err.message);
    }
});

app.post('/books', async (req, res) => {
    const { bookCode, title, basePrice } = req.body;

    if (!bookCode.startsWith(STUDENT_PREFIX)) {
        req.session.errorMessage = `Lỗi: Mã sản phẩm phải bắt đầu bằng '${STUDENT_PREFIX}'!`;
        return res.redirect('/');
    }

    const price = parseFloat(basePrice);
    const finalPrice = price + (price * (VAT_RATE / 100));

    try {
        const newBook = new BookWriteModel({
            bookCode,
            title,
            basePrice: price,
            vatRate: VAT_RATE,
            finalPrice: finalPrice
        });
        await newBook.save();

        req.session.successMessage = "Thêm sách mới thành công!";
        res.redirect('/');
    } catch (err) {
        req.session.errorMessage = "Lỗi khi lưu sách (có thể trùng mã): " + err.message;
        res.redirect('/');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});