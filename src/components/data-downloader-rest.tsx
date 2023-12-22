class DownloadData {

    public async downloadData(format: string, uuid: any) {
        try {
            const response = await fetch(`http://localhost:8080/v1/courses/uuid/${uuid}`);
            let data = await response.json();

            if(format === 'md'){
                data = Object.values(data.course_content.content).map(value => value.content.replace(/\\n/g, '\n')).join('\n');
            } else {
                data = JSON.stringify(data);
            }

            const blob = new Blob([data], {type: format === 'json' ? 'application/json' : 'text/plain'});

            const handle = await window.showSaveFilePicker({
                suggestedName: `course.${format}`,
                types: [
                    {
                        description: 'Text Files',
                        accept: {
                            'application/json': ['.json'],
                            'text/plain': ['.md', '.txt'],
                        },
                    },
                ],
            });

            const writable = await handle.createWritable();

            // Write the contents of the blob to the file.
            await writable.write(blob);

            // Close the file and write the contents to disk.
            await writable.close();

        } catch (error: any) {
            if (error.name === 'AbortError') {
                console.log('File saving was aborted.');
            } else {
                // Handle other errors
                console.error('An error occurred:', error);
            }
        }
    }

    public async getCourseData(uuid: any) {
        try {
            const response = await fetch(`http://localhost:8080/v1/courses/uuid/${uuid}`);
            if (!response.ok) {
                if(response.status >= 400 && response.status < 500) {
                    console.log("Course not found");
                    return "Course not found";
                }
                throw new Error(response.statusText);
            }
            let data = await response.json();
            if(data.message === "Course generation is in progress") {
                console.log("Course generation is in progress");
                return "Course generation is in progress";
            }
            if(data.course_content) {
                let updatedData = Object.entries(data.course_content.content).reduce((acc, [key, value]) => {
                    acc[key] = {...value, content: value.content.replace(/\\n/g, '\n')};
                    return acc;
                }, {});
                data.course_content.content = updatedData;
            }
            console.log(data.course_content.course_name);
            return data;
        } catch (error) {
            console.error('There was an error!', error);
        }
    }

}

export default DownloadData;