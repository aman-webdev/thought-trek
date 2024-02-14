export  interface Blog {
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
    _id?:string;
    comments:Comment[];
    likes:Vote[]
}

export interface Comment {
    comment:string;
    _blogId:string;
    _userId:string;
    totalLikes:number;
    _id:string;
    likes:Vote[]
}

export interface Vote {
    _id:string;
    _userId:string;
    parentId:string;
    parentType:"Blog" | "Comment" ;

}

