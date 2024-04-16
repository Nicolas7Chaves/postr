import './styles.scss'
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from '../firebase-config';
import { useEffect, useState } from 'react';

function Post() {
    const [postText, setPostText] = useState('');
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            setUser(user);
        });
        return () => unsubscribe();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (user) {
            try {
                const docRef = await addDoc(collection(db, "posts"), {
                    body: postText,
                    uid: user.uid,
                    createdAt: serverTimestamp()
                });
                console.log("Document written with ID: ", docRef.id);
                setPostText('');
            } catch (e) {
                console.error("Error adding document: ", e);
            }
        }
        else {
            console.error("User not logged in")
        }

    }
    return (
        <>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="What do you want to post?"
                    value={postText} onChange={(e) => setPostText(e.target.value)} />
                <button type='submit'>Post</button>
            </form>
        </>
    )
}

export default Post;