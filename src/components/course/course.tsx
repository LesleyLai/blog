import { Icon } from "semantic-ui-react";

import Collapsible from 'react-collapsible';
import * as React from "react";


function getPlatform(platformCode: String): String {
    const platformMap = {
        coursera: "coursera.org",
        edx: "edx.org",
    };

    const platformName = platformMap[platformCode];
    if (!platformName) {
        throw Error("Gets an unknown mooc platform");
    }

    return platformName;
}


interface CourseProp {
    courseInfo: {
        frontmatter: {
            title: string;
            complete: string;
            platform: string;
            institution: string;
            certification: string;
            link: string;
            categories: string;
            rating: number;
        };
        html: string;
    }
}

const Course = ({ courseInfo }: CourseProp) => {
    const meta = courseInfo.frontmatter;
    const css = require("./course.module.css");

    const trigger = (
        <div className={css.title}>
            {meta.title}
            <span className={css.platform}> ({getPlatform(meta.platform)})</span>
            <Icon name='dropdown' />
        </div>
    );

    return (
        <Collapsible trigger={trigger} transitionTime={200}
            classParentString={css.course}
            contentInnerClassName={css.content} >
            <p> Provide by: {meta.institution} </p>

            <div dangerouslySetInnerHTML={{ __html: courseInfo.html }} className={css.description} />

            <ol>
                <li>
                    {meta.link ?
                        <p>Access course material <a href={meta.link}>here</a>.</p> :
                        null
                    }
                </li>
                <li>
                    {meta.certification ?
                        <p>See my certification <a href={meta.certification}>here</a>.</p> :
                        null
                    }
                </li>
            </ol>


        </Collapsible >
    );
}

export default Course;
