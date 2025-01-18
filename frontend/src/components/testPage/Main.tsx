import Error from "../Panel/Error/Error.tsx";
import { v4 as uuidv4 } from 'uuid';
import {useState} from "react";

function Page() {
    const [uuid, setUuid] = useState(uuidv4())

    function createUUID(){
        setUuid(uuidv4())
    }

    fetch('http://localhost:5927/demo')
        .then(response => response.json())
        .then(res => console.log("Successfully", res))

    const list = [
        {id: 1, text: "总的来说，无论是前端还是后端开发，高效的流程和工具选型都是成功的关键因素。开发团队在实践中应根据具体需求和技术背景，灵活调整开发策略，不断优化工作流程，以适应快速发展的技术环境。"},
        {id: 2, text: "总的来说，无论是前端还是后端开发，高效的流程和工具选型都是成功的关键因素。开发团队在实践中应根据具体需求和技术背景，灵活调整开发策略，不断优化工作流程，以适应快速发展的技术环境。"},
        {id: 3, text: "总的来说，无论是前端还是后端开发，高效的流程和工具选型都是成功的关键因素。开发团队在实践中应根据具体需求和技术背景，灵活调整开发策略，不断优化工作流程，以适应快速发展的技术环境。"},
        {id: 4, text: "总的来说，无论是前端还是后端开发，高效的流程和工具选型都是成功的关键因素。开发团队在实践中应根据具体需求和技术背景，灵活调整开发策略，不断优化工作流程，以适应快速发展的技术环境。"},
    ]
    const res = list.map(person => <li key= {person.id}>{person.text}</li>)

    return (
        <div className={"my-0 mx-auto w-[400px] leading-loose"}>
            <Error></Error>
            <h1 className={"font-bold text-center"}>Test Page</h1>
            <article className={"text-start"}>
                <header>
                    <h1>如何高效规划与优化前端与后端的开发流程</h1>
                </header>
                <section>
                    <p>随着全栈开发的普及，如何在前端和后端之间实现高效的协作和优化开发流程，成为了许多开发团队关注的重点。无论是单纯的前端应用，还是包含复杂后端服务的全栈项目，合理的开发流程规划和工具选型都是提升工作效率和项目质量的关键。</p>
                </section>
                <section>
                    <h2>一、项目需求与目标明确</h2>
                    <p>无论是前端开发还是后端开发，首先都要明确项目的需求和目标。只有对项目有清晰的认识，才能更好地选择适合的技术栈和开发工具。在前端开发中，需要确定用户界面（UI）的设计与交互效果；在后端开发中，需要明确服务的功能、数据存储和处理逻辑。</p>
                </section>
                <section>
                    <h2>二、选择合适的技术栈</h2>
                    <p>前端技术栈的选择直接影响到开发效率和项目的可维护性。例如，使用 Vite + React + TypeScript 构建前端项目，可以加速开发、提高代码的可读性与可维护性。而后端服务可以选择 Node.js 和 TypeScript，这样能够使前后端的语言保持一致，减少语言切换带来的开发障碍。</p>
                </section>
                <section>
                    <h2>三、工具和环境配置</h2>
                    <p>前端项目中，使用 Vite 来进行构建和热更新，能够极大提升开发效率。与此同时，使用 Tailwind CSS 进行样式开发，不仅减少了 CSS 代码的编写量，还保证了样式的一致性。在后端开发中，Node.js 提供了丰富的生态和高效的性能，可以与各种数据库（如 MongoDB、PostgreSQL）良好集成。</p>
                </section>
                <section>
                    <h2>四、API 与数据交换规范</h2>
                    <p>前后端开发的一个关键点是数据交换。RESTful API 是当前最流行的 API 风格，简单且易于理解。但在一些复杂的应用场景下，GraphQL 可能更具优势，允许客户端根据需求精确查询数据。在实际开发中，API 设计要遵循清晰的规范，确保前后端协作的顺畅。</p>
                </section>
                <section>
                    <h2>五、CI/CD 与自动化测试</h2>
                    <p>为了提升开发效率，避免手动操作带来的错误，持续集成（CI）和持续交付（CD）是现代开发流程的重要组成部分。在 CI/CD 环境中，开发者可以通过自动化测试、代码检查和构建部署来确保项目始终处于一个可用和稳定的状态。工具如 GitHub Actions 或 Jenkins 可以帮助团队实现自动化部署和监控。</p>
                </section>
                <section>
                    <h2>六、项目维护与迭代</h2>
                    <p>项目发布后，持续的维护和更新是开发流程中的必备环节。前端和后端开发人员需要协作处理bug修复、性能优化、功能迭代等任务。使用 Git 进行版本控制，配合 Issue 管理，可以帮助团队高效地追踪任务和处理反馈。</p>
                </section>
                <section>
                    <h2>七、总结</h2>
                    <p>高效的前后端开发流程不仅能提升开发效率，还能有效降低项目的风险。通过合理的需求分析、技术栈选择、工具配置和开发规范，可以确保项目在开发和交付过程中的顺利进行。而
                        CI/CD、自动化测试等现代开发工具，则为整个流程提供了有力的保障。</p>
                    <p>总的来说，无论是前端还是后端开发，高效的流程和工具选型都是成功的关键因素。开发团队在实践中应根据具体需求和技术背景，灵活调整开发策略，不断优化工作流程，以适应快速发展的技术环境。</p>
                    <ul>{res}</ul>
                </section>
            </article>
            <button onClick={createUUID} className="mt-4 p-2 bg-blue-500 text-white">生成 UUID</button>
            <p>当前 UUID: {uuid}</p>
        </div>
    )
}

export default Page