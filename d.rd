//     const [title, setTitle] = useState("")
//     const [tacgia, setTacgia] = useState("")
//     const [category_id, setCategory_id] = useState("")
//     const [total_copies, setTotal_copies] = useState("")
//     const [available_copies, setAvailable_copies] = useState("")
//   // load danh sách sách
//   const fetchBooks = async () => {
//     const data = await getBooks();
//     setBooks(data);
//   };

//   useEffect(() => {
//     fetchBooks();
//   }, []);

//     async function handlesubmit(e) {
//         e.preventDefault()
//         if (!title || !tacgia || !category_id || !total_copies || !available_copies) return alert("Nhập đủ thông tin!")
//         await createBooks({ title, tacgia, category_id, total_copies, available_copies })
//         setTitle("")
//         setTacgia("")
//         setCategory_id("")
//         setTotal_copies("")
//         setAvailable_copies("")
//         reload()
//     }