export default interface Blog {
    title:string;
    desc:string;
    slug:string;
    _userId:{
        username:string;
        profilePicture?:string
    };
    body:string;
    image?:string;
    categories?:[string]
    createdAt?:string;
    updatedAt?:string;
    _id?:string
}